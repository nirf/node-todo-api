var mongoose = require('mongoose')

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'
//setting mongoose to use promise
mongoose.Promise = global.Promise
mongoose.connect(mongoUri, {
    useMongoClient: true
}, () => {
    console.log(`Connected to mongo on ${mongoUri}`)
})

module.exports = {
    mongoose
}