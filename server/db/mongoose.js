var mongoose = require('mongoose')

//setting mongoose to use promise
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
}, () => {
    console.log('Connected to mongo')
})

module.exports = {
    mongoose
}