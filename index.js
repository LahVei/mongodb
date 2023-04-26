const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
 
  //Expressiin sisäänrakennettua middlewarea static näyttää
//staattista sisältöä eli sivun index.html ja sen lataaman JavaScriptin 
//tarkistaa build kansiosta index.html
app.use(express.static('build'))
//***************************************************** */
//ok
 
//Expressenin middleware muuttaa post pyynnöissä mukana olevan JSON-muotoisen 
//datan JavaScript-olioksi ja sijoittaa sen request olion kenttään body.
//Middlewaret ovat funktioita, joiden avulla voidaan käsitellä request- ja response-olioita
app.use(express.json())
// tulostaa konsoliin palvelimelle tulevien pyyntöjen perustietoja.
// json-parseri tulee ottaa käyttöön ennen middlewarea requestLogger, 
//muuten request.body ei ole vielä alustettu loggeria suoritettaessa!
require('dotenv').config()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  //console.log('headers:  ', request.headers)
  console.log('---')
  next()
}
app.use(cors())
//Middlewaret tulee ottaa käyttöön ennen routeja
app.use(requestLogger)
 
 
//haetaan data tietokannasta ja tulostetaan
Person.find({}).then(result => {
  result.forEach(item => {
    console.log(item)
  })
  mongoose.connection.close()
})
/*
const person = new Person({
  name: 'Samuli',
  number: '34566'
})
person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})
 */


  //kutsuu jokaiselle tietokannasta luettavalle muistiinpanolle 
  //automaattisesti metodia toJSON muodostaessaan vastausta.
  //const Person = mongoose.model('Person', noteSchema)

  app.get('/api/persons', (request, response) => {
    console.log('tulee renderiin --> user app yritys haku db')
    Person.find({}).then(items => {
   
      response.json(items)
    })
  })
 
  
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
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
      //virhetilanteen käsittelyä siirretään eteenpäin funktiolla next
      .catch(error => next(error))
  })
      
    //person.forEach(item => {
     // console.log(item)
   // })
   
    //mongoose.connection.close()
  //})

    /*if (person) {
      response.json(person)
    } else {
    //metodia end ilmoittamaan siitä, että pyyntöön tulee vastata ilman dataa.
      response.status(404).end()
      /*Lisätään routen jälkeen middleware, jonka 
      ansiosta saadaan routen käsittelemättömästä virhetilanteesta 
      JSON-muotoinen virheilmoitus: 
     
    }*/
  

  app.get('/api/info', (request, response) => {
    const pituus = persons.length
    const d = new Date();
    let time = d.toLocaleString();
    response.send(`<p>Phonebook has info for ${pituus} people</><p>${time}`)
  })
 
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
        //persons = persons.filter(item => item.id !== id)
      })
      .catch(error => next(error))
  })
  
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
   console.log('user lisäys tietokantaan')
    if (!body.name) {
    //returnin kutsuminen on tärkeää. Ilman kutsua koodi jatkaisi suoritusta metodin 
    //loppuun asti, ja virheellinen muistiinpano tallettuisi!
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
      //returnin kutsuminen on tärkeää. Ilman kutsua koodi jatkaisi suoritusta metodin 
      //loppuun asti, ja virheellinen muistiinpano tallettuisi!
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
      /*if(persons.find(item=>item.name === body.name)){
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }*/
 
      const person = new Person({
        name: body.name,
        number: body.number || 0,
      })
    //persons = persons.concat(person)
    person.save().then(savedPerson => {
      response.json(savedPerson )
    })
  })
  // numeron vaihto
  app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const id = Number(request.params.id)
     
   const changedPerson = 
    {
      name:body.name,
      number:body.number,
      id:id
    }
    //persons = persons.filter(item => item.id != id)
    //persons = persons.concat(changedPerson)
    //response.json(changedPerson)
  })
  //routejen käsittelemättömistä virhetilanteista palautetaan JSON-muotoinen virheilmoitus
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
 

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    //Jos funktion next kutsussa annetaan parametri, siirtyy käsittely 
    //virheidenkäsittelymiddlewarelle, muuten siirtyy seuraavalle routelle tai middlewarelle
    next(error)
  }
  // tämä tulee kaikkien muiden middlewarejen rekisteröintien jälkeen!
app.use(errorHandler)
app.use(unknownEndpoint)
/*app.listen(PORT)
console.log(`Server running on port ${PORT}`)*/
//Ympäristömuuttja
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//DB
//mongodb+srv://fellow90:<password>@milkyway.r8adrjm.mongodb.net/?retryWrites=true&w=majority
