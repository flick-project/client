import { Link } from 'react-router-dom'
import { Compass, Bookmark, User } from 'lucide-react'

function Navigation() {
  return (
    <nav>
      <h1 className="text-2xl font-semibold mb-8">Flick</h1>
      <ul className="flex flex-col gap-2">
        <li>
          <Link to="/" className="flex items-center gap-4 p-2 hover:text-brand">
            <Compass size={20} />
            Discover
          </Link>
        </li>
        <li>
          <Link to="/watchlist" className="flex items-center gap-4 p-2 hover:text-brand">
          <Bookmark size={20} />
          Watchlist
          </Link>
        </li>
        <li>
          <Link to="/profile" className="flex items-center gap-4 p-2 hover:text-brand">
          <User size={20} />
          Profile
          </Link>
        </li>
      </ul>
      <button className="w-full mt-8 flex items-center justify-center gap-4 p-2 rounded bg-brand hover:bg-red-700 text-white">
        Log in
      </button>
    </nav>
  )
}

export default Navigation
