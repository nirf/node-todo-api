const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

let user1Id = new ObjectID()
let user2Id = new ObjectID()

const users = [{
    _id: user1Id,
    email: 'user1@mail.com',
    password: 'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'}, 'secret').toString()
    }]
}, {
    _id: user2Id,
    email: 'user2@mail.com',
    password: 'user2pass'
}]


const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second tests todo',
    completed: true,
    completedAt: 333
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save()
        var user2 = new User(users[1]).save()

        return Promise.all([user1, user2])
    }).then(() => done())
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}