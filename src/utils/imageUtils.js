export const posterUrl = (posterPath, width) =>
  `${import.meta.env.VITE_API_URL}/images/posters${posterPath}?w=${width}`

export const backdropUrl = (backdropPath, width) =>
  `${import.meta.env.VITE_API_URL}/images/backdrops${backdropPath}?w=${width}`
