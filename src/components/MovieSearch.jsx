import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api.js'
import Input from '../components/Input.jsx'

/**
 * Searchable movie list that queries TMDB and displays results.
 * @param {object} props - Component props.
 * @param {(movie: object) => void} props.onSelect - Callback when a movie is selected.
 * @returns {React.ReactElement} The MovieSearch component.
 */
export default function MovieSearch ({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      try {
        const result = await apiRequest(`/movies/search?query=${query}`)
        setResults(result.results)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className='flex flex-col items-center justify-center'>
      <Input type='text' placeholder='Search movie' value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map(movie => (
        <li onClick={() => onSelect(movie)} key={movie.id}>{movie.title}</li>
      ))}
      </ul>
    </div>
  )
}
