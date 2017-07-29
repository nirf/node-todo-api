const {MongoClient, ObjectID, Db} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server', error)
    }
    console.log('Connected to MongoDB server')

    //ok - 1 all good
    //deleteMany
    db.collection('Todos').deleteMany({text: 'Something to do'}).then((result) => {
        console.log(result)
    })
    //deleteOne - delete the first and stops
    db.collection('Todos').deleteOne({text: 'Something to do'}).then((result) => {
        console.log(result)
    })
    //findOneAndDelete - same as above but returns the object
    db.collection('Todos').findOneAndDelete({text: 'do y'}).then((result) => {
        console.log(result)
    })
    // db.close()
})