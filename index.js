
const express = require('express')

let notes = [
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

app.get('/', (request, response) => {
  response.send('<h1>hola mundo express</h1>')
})
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})
app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    return response.status(400).json({
      Error: 'note.Content is missing'
    })
  }
  const ids = notes.map(notes => notes.id)
  const MaxId = Math.max(...ids)
  const NewNote = {
    id: MaxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, NewNote]
  response.status(201).json(NewNote)
})
app.use((request, response) => {
  response.status(404).json({
    Error: 'Not Found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
