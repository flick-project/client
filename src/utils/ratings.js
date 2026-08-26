import hate from '../assets/emoji/pouting_face.svg'
import dislike from '../assets/emoji/confused_face.svg'
import neutral from '../assets/emoji/neutral_face.svg'
import like from '../assets/emoji/slightly_smiling_face.svg'
import love from '../assets/emoji/smiling_face_with_heart-eyes.svg'

export const RATINGS = [
  { value: 'hate', emoji: hate, label: 'Hated it', pastTense: 'Hated' },
  { value: 'dislike', emoji: dislike, label: 'Disliked it', pastTense: 'Disliked' },
  { value: 'neutral', emoji: neutral, label: 'Neutral', pastTense: 'Neutral' },
  { value: 'like', emoji: like, label: 'Liked it', pastTense: 'Liked' },
  { value: 'love', emoji: love, label: 'Loved it', pastTense: 'Loved' }
]

export const findRating = (value) => RATINGS.find(r => r.value === value)
