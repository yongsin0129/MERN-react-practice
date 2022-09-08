const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

userSchema.methods.isStudent = function () {
  return this.role === 'student'
}

userSchema.methods.isInstructor = function () {
  return this.role === 'instructor'
}

// mongoose schema middleware
userSchema.pre('save', async next => {
  if (this.isModified('password') || this.isNew) {
    const hash = bcrypt.hash(this.password, 10)
    this.password = hash
    next()
  } else {
    return next()
  }
})

userSchema.methods.comparePassword = (password, callback) => {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return callback(err, isMatch)
    else {
      return callback(null, isMatch)
    }
  })
}

module.exports = mongoose.model('User', userSchema)