export const entries = [
  {
    type: 'music',
    artist: 'artist',
    title: 'title',
    genre: 'genre',
    links: [],
    subreddits: [],
    score: 10, // used for chance of posting - 10 always posts - 0 never posts - decimals allowed
  }
]

export const subreddits = [
  {
    name: 'name',
    format: 'artist -- title [genre] (year)',
    restrictions: ['youtubeOnly']
  }
]