const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

let userId = '597cb0c6909a0f304d135339'

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('userId not found')
    }
    console.log('User By Id', user)
}).catch((e) => {
    console.log(e)
})

// let id = '597f61bc7c1d6c3497e632de11'
//
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid')
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// })
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo)
// })
//
// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo By Id', todo)
// }).catch((e) => {
//     console.log(e)
// })