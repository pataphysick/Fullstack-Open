const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'Malformed ID'})
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message})
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'Expected "username" to be unique' })
  }
  next(error)
}

module.exports = {
  errorHandler
}