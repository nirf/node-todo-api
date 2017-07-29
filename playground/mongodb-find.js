const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server', error)
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').find({
    //     _id: new ObjectID('597c7a4c2d977c2dcce3c4be')
    // }).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    db.collection('Users').find({name: 'Nir Fiegelshtein'}).count().then((count) => {
        console.log(`Todos #${count}`)
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })

    db.collection('Users').find({name: 'Nir Fiegelshtein'}).toArray().then((docs) => {
        console.log(docs)
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })
    // db.close()
})