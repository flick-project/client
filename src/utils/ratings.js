export const RATINGS = [
  { value: 'hate', emoji: '😡', label: 'Hate', pastTense: 'Hated', activeClass: 'bg-red-400/15 ring-red-400/40' },
  { value: 'dislike', emoji: '😐', label: 'Dislike', pastTense: 'Disliked', activeClass: 'bg-orange-400/15 ring-orange-400/40' },
  { value: 'like', emoji: '🙂', label: 'Like', pastTense: 'Liked', activeClass: 'bg-green-400/15 ring-green-400/40' },
  { value: 'love', emoji: '😍', label: 'Love', pastTense: 'Loved', activeClass: 'bg-pink-400/15 ring-pink-400/40' }
]

export const findRating = (value) => RATINGS.find(r => r.value === value)
