const express = require('express')
const cors = require('cors')
const app = express()
//Expressenin middleware muuttaa post pyynnöissä mukana olevan JSON-muotoisen 
//datan JavaScript-olioksi ja sijoittaa sen request olion kenttään body.
//Middlewaret ovat funktioita, joiden avulla voidaan käsitellä request- ja response-olioita
app.use(express.json())
// tulostaa konsoliin palvelimelle tulevien pyyntöjen perustietoja.
// json-parseri tulee ottaa käyttöön ennen middlewarea requestLogger, 
//muuten request.body ei ole vielä alustettu loggeria suoritettaessa!

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

//Expressiin sisäänrakennettua middlewarea static näyttää
//staattista sisältöä eli sivun index.html ja sen lataaman JavaScriptin 
//tarkistaa build kansiosta index.html
app.use(express.static('build'))
let persons = [
    {
      id: 1,
      name: "Pasi Puhakka",
      number: "040-533 5656"
    },
    {
      id: 2,
      name: "Jussi Juonio",
      number: "040-599 2233"
    },
    {
      id: 3,
      name: "Peter Pan",
      number: "050-288 8822"
    }
  ]
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(item => item.id === id)
    
    if (person) {
      response.json(person)
    } else {
    //metodia end ilmoittamaan siitä, että pyyntöön tulee vastata ilman dataa.
      response.status(404).end()
      /*Lisätään routen jälkeen middleware, jonka 
      ansiosta saadaan routen käsittelemättömästä virhetilanteesta 
      JSON-muotoinen virheilmoitus: */
     
    }
  })
  app.get('/api/info', (request, response) => {
    const pituus = persons.length
    const d = new Date();
    let time = d.toLocaleString();
    response.send(`<p>Phonebook has info for ${pituus} people</><p>${time}`)
  })
  app.delete('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id)
    console.log('delete ', id)
    persons = persons.filter(item => item.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
  
    return Math.floor(Math.random()*10000000)
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
   
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
      if(persons.find(item=>item.name === body.name)){
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
 
    const person = {
      name: body.name,
      number: body.number || 0,
      id: generateId(),
    }
    persons = persons.concat(person)
   response.json(person)
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
    persons = persons.filter(item => item.id != id)
    persons = persons.concat(changedPerson)
    response.json(changedPerson)
  })
  //routejen käsittelemättömistä virhetilanteista palautetaan JSON-muotoinen virheilmoitus
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)
 
/*app.listen(PORT)
console.log(`Server running on port ${PORT}`)*/
//Ympäristömuuttja
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
