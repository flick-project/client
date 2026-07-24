import { useState, useCallback } from 'react'
import { ImportContext } from './ImportContext.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { apiRequest } from '../services/api.js'
import { unzipSync, strFromU8 } from 'fflate'
import Papa from 'papaparse'

const extractCSV = async (file) => {
  if (file.name.toLowerCase().endsWith('.zip')) {
    const buffer = new Uint8Array(await file.arrayBuffer())
    const unzipped = unzipSync(buffer)
    const files = Object.keys(unzipped)
    const csvFile = files.find(name => name.toLowerCase().includes('ratings') && name.toLowerCase().endsWith('.csv')) ||
      files.find(name => name.toLowerCase().endsWith('.csv'))
    if (!csvFile) throw new Error('No CSV file found in zip.')
    return strFromU8(unzipped[csvFile])
  }
  return file.text()
}

const RATING_MAP = {
  imdb: (score) => {
    const n = Number(score)
    if (n >= 8) return 'love'
    if (n >= 6) return 'like'
    if (n >= 4) return 'dislike'
    return 'hate'
  },
  tmdb: (score) => {
    const n = Number(score)
    if (n >= 8) return 'love'
    if (n >= 6) return 'like'
    if (n >= 4) return 'dislike'
    return 'hate'
  },
  letterboxd: (score) => {
    const n = Number(score)
    if (n >= 4) return 'love'
    if (n >= 3) return 'like'
    if (n >= 2) return 'dislike'
    return 'hate'
  }
}

const parseCSV = (text) => {
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
  return data
}

const buildRatings = (rows, platform) => {
  const map = RATING_MAP[platform]
  if (platform === 'imdb') {
    return rows
      .filter(r => r['Your Rating'])
      .map(r => ({ imdbId: r['Const'], rating: map(r['Your Rating']) }))
  }
  if (platform === 'tmdb') {
    return rows
      .filter(r => r['Your Rating'] && r['Type'] === 'movie')
      .map(r => ({ tmdbId: Number(r['TMDb ID']), rating: map(r['Your Rating']) }))
  }
  if (platform === 'letterboxd') {
    return rows
      .filter(r => r['Rating'])
      .map(r => ({ title: r['Name'], year: Number(r['Year']), rating: map(r['Rating']) }))
  }
  return []
}

const detectPlatform = (rows) => {
  const keys = Object.keys(rows[0] || {})
  if (keys.includes('Const') && keys.includes('Your Rating')) return 'imdb'
  if (keys.includes('TMDb ID') && keys.includes('Your Rating')) return 'tmdb'
  if (keys.includes('Name') && keys.includes('Rating') && keys.includes('Year')) return 'letterboxd'
  return null
}

/**
 * Provides import state and controls to the app.
 * State survives navigation since it lives at the app level.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function ImportProvider ({ children }) {
  const { token } = useAuth()
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  const startImport = useCallback(async (file) => {
    const text = await extractCSV(file)
    const rows = parseCSV(text)
    const platform = detectPlatform(rows)

    if (!platform) {
      setError('Unrecognized file. Please upload a CSV export from IMDB, TMDB, or Letterboxd.')
      return
    }

    const ratings = buildRatings(rows, platform)

    if (!ratings.length) {
      setError('No ratings found. Make sure you uploaded the right file.')
      return
    }

    setStatus('importing')
    setProgress(0)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/import/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ratings })
      })

      if (!response.ok) {
        throw new Error('Import request failed.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))

          if (data.done) {
            setSummary(data)
            setStatus('done')
            localStorage.removeItem('discovery_queue')
            window.dispatchEvent(new Event('import-complete'))
            try {
              await apiRequest('/movies/restock', { method: 'POST' })
            } catch {
              // non-critical
            }
          } else {
            setProgress(Math.round((data.processed / data.total) * 100))
          }
        }
      }
    } catch {
      setError('Import failed. Please try again.')
      setStatus('idle')
    }
  }, [token])

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setSummary(null)
    setError(null)
  }, [])

  return (
    <ImportContext value={{
      status,
      progress,
      summary,
      error,
      startImport,
      reset
    }}
    >
      {children}
    </ImportContext>
  )
}
