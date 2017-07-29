const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server', error)
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err)
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2))
    // })

    //insert new doc into the Users collections(name, age, location)
//     db.collection('Users').insertOne({
//         name: 'Nir Fiegelshtein',
//         age: 32,
//         location: 'Hatanim 7 Herzlia'
//     }, (err, res) => {
//         if (err) {
//             return console.log('Unable to insert user', err)
//         }
//         console.log(res.ops[0]._id.getTimestamp())
//     })
    db.close()
})