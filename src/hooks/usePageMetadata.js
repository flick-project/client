import { useEffect } from 'react'

const DEFAULT_DESCRIPTION = 'Movie discovery app. Find your next favorite film, build your watchlist, and rate what you\'ve seen.'

/**
 * Set the page's title and metadescription.
 * @param {string} title - Page title.
 * @param {string} description - Page description.
 */
export function usePageMetadata (title, description) {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    // Use the provided description if it exists, otherwise use default.
    const finalDescription = description !== undefined ? description : DEFAULT_DESCRIPTION

    let metaDesc = document.querySelector('meta[name="description"]')
    if (finalDescription) {
      if (metaDesc) {
        metaDesc.setAttribute('content', finalDescription)
      } else {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        metaDesc.content = finalDescription
        document.head.appendChild(metaDesc)
      }
    }
  }, [title, description])
}
