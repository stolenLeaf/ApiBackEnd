
const express = require('express')
const cors = require('cors')
const User = require('./models/user')
const Post = require('./models/Post')

const userExtractor = require('./middleware/userExtractor')

const posts = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en YouTube',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar las clases del FullStack Bootcamp',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'Repasar los retos de JS de midudev',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>hola mundo express</h1>')
})
app.get('/api/Posts', (request, response) => {
  response.json(posts)
})
// listo
app.get('/api/Posts/:id', (request, response, next) => {
  const { id } = request.params
  Post.findById(id)
    .then(post => {
      if (post) return response.json(post)
      response.status(404).end()
    })
    .catch(err => next(err))
})
// listo
app.delete('/api/Posts/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  const res = await Post.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)

  response.status(204).end()
})
app.post('/api/Posts', userExtractor, async (request, response, next) => {
  const {
    subject,
    content
  } = request.body
  // sacar id de request
  const { userID } = request
  const user = await User.findById(userID)
  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }
  if (!subject) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newPost = new Post({
    subject,
    content,
    date: new Date().toISOString(),
    user: user._id
  })
  try {
    const savePost = await newPost.save()
    user.posts = user.posts.concat(savePost._id)
    await user.save()
    response.json(savePost)
  } catch (error) {
    next(error)
  }
})
// listo
app.put('/api/Posts/:id', (request, response, next) => {
  const { id } = request.params
  const post = request.body
  const newPostinfo = {
    subject: Post.subject,
    content: Post.content
  }

  Post.findByIdAndUpdate(id, newPostinfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(next)
})
app.use((request, response) => {
  response.status(404).json({
    Error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
