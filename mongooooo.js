const mongoose = require('mongoose')

/*if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
*/
 
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
const apu = process.argv[2]
const url =
`mongodb+srv://milky:${apu}@milkyway.sgse8eg.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})
//muokataan kannasta haettavilla olioilla olevan toJSON-metodin palauttamaa muotoa
//poistetaan versio kenttä __v (todellisuudessa olio ei string)
//toJSON muuttaa sen merkkijonoksi 
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
 
const Person = mongoose.model('Person', noteSchema)

const person = new Person({
  name:process.argv[3],
  number:process.argv[4],
})


/*Person.find({}).then(result => {
  result.forEach(item => {
    console.log(item)
  })
  mongoose.connection.close()
})*/

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})