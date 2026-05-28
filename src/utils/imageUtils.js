export const posterUrl = (posterPath, width) =>
  `${import.meta.env.VITE_API_URL}/images/poster${posterPath}?w=${width}`
