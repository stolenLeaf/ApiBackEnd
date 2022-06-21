const { model, Schema } = require('mongoose')
const postSchema = new Schema({
  subject: String,
  content: String,
  user: String,
  edit: Boolean,
  date: Date,
  erased: Boolean,
  status: Boolean,
  motivo: String
})

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Post = model('post', postSchema)

module.exports = Post
