const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Todo.remove({}).then((todos) => {
//     console.log(todos)
// })

// Todo.findOneAndRemove({_id: '59807d931a48bffacf235a20'}).then((todo) => {
//     console.log(todo)
// })

Todo.findByIdAndRemove('5980a23745c228631d3ddbdc').then((todo) => {
    if(todo) {
        console.log('exists')
    }
    if(!todo) {
        console.log('not exists')
    }
})