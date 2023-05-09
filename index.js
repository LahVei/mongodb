const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
 
app.use(express.static('build'))
app.use(express.json())
app.use(cors)
require('dotenv').config()
console.log('nyt backendissä')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
 
  console.log('---')
  next()
}

app.use(requestLogger)
 
app.get('/api/persons', (request, response, next) => {
console.log('tulee renderiin --> user haku db')
Person.find({})
.then(items => {
  response.json(items)
}) 
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})
app.get('/api/info', (request, response, next) => {
  Person.find({})
  .then(items => {
    const pituus = items.length
    const d = new Date();
    let time = d.toLocaleString();
    response.send(`<p>Phonebook has info for ${pituus} people</><p>${time}`)
  }) 
  .catch(error => {
    console.log(error)
    next(error)
  })
})
 
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})
 
 app.post('/api/persons', (request, response, next) => {
  console.log('data lisäys tietokantaan')
  const body = request.body
 
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    
    person.save().then(savedPerson => {
      response.json(savedPerson )
    })
    .catch(error=>{
      console.log(error)
      next(error)
    })
  
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
       next(error)
    })
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('error käsittely')
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT||3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


 