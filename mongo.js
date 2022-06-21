const mongoose = require('mongoose')
const password = require('./credenciales.js')
const connectionString = `mongodb+srv://Stolen:${password}@cluster0.16ddbbi.mongodb.net/app?retryWrites=true&w=majority`
// conexion a mongo
mongoose.connect(connectionString)
  .then(() => {
    console.log('db conectada')
  }).catch(err => {
    console.err(err)
  })
// schema de db

const post = new Post({
  subject: 'esto es una prueba',
  content: 'contenido de prueba',
  user: 'Stolen',
  edit: false,
  date: new Date().toISOString(),
  erased: false,
  status: true,
  motivo: 'funciona'
})
post.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => {
    console.err(err)
  })
