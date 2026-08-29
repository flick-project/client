import { useState, useRef, use } from 'react'
import Button from './Button'
import { Check, SkipForward, HelpCircle, Upload } from 'lucide-react'
import { ImportContext } from '../context/ImportContext.jsx'

const platforms = [
  {
    value: 'imdb',
    label: 'IMDB',
    instructions: 'On imdb.com, go to your account, open Your Ratings, tap the three dots in the top right and hit Export.'
  },
  {
    value: 'tmdb',
    label: 'TMDB',
    instructions: 'On themoviedb.org, click your profile picture, open Ratings, tap the three dots and choose Export CSV.'
  },
  {
    value: 'letterboxd',
    label: 'Letterboxd',
    instructions: 'On letterboxd.com, go to Settings, then Import & Export, and click Export Your Data. Upload the zip file directly or extract ratings.csv first.'
  }
]

/**
 * Panel for importing movie ratings from IMDB, TMDB, or Letterboxd.
 * Shows platform instructions via tabs and a drop zone for file upload.
 * Auto-detects the file format on upload and begins importing immediately.
 * @param {object} props - Component props.
 * @param {() => void} [props.onDone] - Called when import is complete or skipped.
 * @returns {JSX.Element} The import panel.
 */
export default function ImportPanel ({ onDone }) {
  const { status, progress, summary, error, startImport, reset } = use(ImportContext)
  const [activeTab, setActiveTab] = useState('imdb')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  const processFile = async (file) => {
    if (!file) return
    await startImport(file)
  }

  const handleInput = (e) => processFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileRef.current?.click()
    }
  }

  if (status === 'done') {
    return (
      <div className='flex flex-col gap-4' role='status' aria-live='polite'>
        <div className='flex flex-col gap-2 text-gray-200'>
          <p className='flex items-center gap-2'>
            <Check size={16} className='text-green-400' aria-hidden='true' />
            {summary.imported} imported
          </p>
          <p className='flex items-center gap-2'>
            <SkipForward size={16} className='text-muted-foreground' aria-hidden='true' />
            {summary.skipped} skipped (already rated)
          </p>
          <p className='flex items-center gap-2'>
            <HelpCircle size={16} className='text-muted-foreground' aria-hidden='true' />
            {summary.notFound} not found
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {onDone && <Button onClick={() => onDone()}>Continue</Button>}
          <Button variant='secondary' onClick={reset}>Import again</Button>
        </div>
      </div>
    )
  }

  if (status === 'importing') {
    return (
      <div
        className='flex flex-col gap-3 p-4 bg-white/4 rounded-lg border border-white/10'
        role='status'
        aria-live='polite'
        aria-label={`Importing ratings, ${progress}% complete`}
      >
        <div className='flex items-center justify-between'>
          <p className='font-medium'>Importing ratings...</p>
          <p className='text-muted-foreground'>{progress}%</p>
        </div>
        <div
          className='w-full bg-white/10 rounded-full h-1.5'
          role='progressbar'
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label='Import progress'
        >
          <div
            className='bg-brand h-1.5 rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-sm text-muted-foreground'>You can leave. The import continues in the background.</p>
      </div>
    )
  }

  const current = platforms.find(p => p.value === activeTab)

  return (
    <div className='flex flex-col gap-4'>
      <nav aria-label='Export instructions'>
        <ul className='flex gap-4' role='tablist'>
          {platforms.map(p => (
            <li key={p.value} role='presentation'>
              <button
                onClick={() => setActiveTab(p.value)}
                role='tab'
                aria-selected={activeTab === p.value}
                className={`text-sm min-h-10 px-1 pb-1 transition-colors cursor-pointer ${
                  activeTab === p.value
                    ? 'text-foreground border-b-2 border-white'
                    : 'text-muted-foreground hover:text-gray-300'
                }`}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <p className='text-sm text-muted-foreground'>{current.instructions}</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role='button'
        aria-label='Select file to import. Drag and drop or click to browse. Accepts CSV or ZIP files.'
        className={`flex flex-col items-center justify-center gap-2 p-8 lg:p-12 rounded-lg border border-dashed cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          dragging
            ? 'border-brand bg-brand/5'
            : 'border-white/30 hover:border-white/50 hover:bg-white/3'
        }`}
      >
        <Upload size={20} className={dragging ? 'text-primary' : 'text-muted-foreground'} aria-hidden='true' />
        <p className='text-muted-foreground'>
          {dragging ? 'Drop file here' : 'Drag and drop or click to browse'}
        </p>
        <p className='text-sm text-muted-foreground'>.csv or .zip</p>
      </div>

      {error && <p className='text-sm text-red-400' role='alert'>{error}</p>}

      <input
        ref={fileRef}
        type='file'
        accept='.csv,.zip'
        className='hidden'
        onChange={handleInput}
        aria-label='Upload ratings file'
        tabIndex={-1}
      />
    </div>
  )
}
