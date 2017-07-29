const {MongoClient, ObjectID, Db} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server', error)
    }
    console.log('Connected to MongoDB server')

    //http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
    //https://docs.mongodb.com/manual/reference/operator/update/
    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     text: 'do y'
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // })
    //updating the users name and age by 1
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('597c7b220a155e2dd1be4bfa')
    }, {
        $set: {
            name: 'Some Name'
        },
        $inc: {
            age: 100
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    })
    // db.close()
})