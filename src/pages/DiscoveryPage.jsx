import CardPlaceholder from '../assets/card-placeholder.png'

/**
 * Discovery page where users swipe through movie suggestions.
 * @returns {React.ReactElement} The DiscoveryPage component.
 */
function DiscoveryPage () {
  return (
    <img
      src={CardPlaceholder}
      alt='Card placeholder'
      className='max-w-full max-h-full lg:h-[80vh] object-contain'
    />
  )
}

export default DiscoveryPage
