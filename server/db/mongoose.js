let mongoose = require('mongoose')

//setting mongoose to use promise
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
}, () => {
    console.log(`Connected to mongo on ${process.env.MONGODB_URI}`)
})

module.exports = {
    mongoose
}