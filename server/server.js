var mongoose = require('mongoose')

//setting mongoose to use promise
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
})

//create models
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

//creating new user model with email - require, trim, lower case, validate
//create the user and test it
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 1,
        // validate: {
        //     isEmail: true
        // },
        index: {
            unique: true
        }
    }
})

var user = new User({email: ' Nir@gmail.com '})
user.save().then((doc) => {
    console.log('save user', doc)
}, (e) => {
    console.log('Unable to save user', e)
})

// var newTodo = new Todo({text: ' Edit '})
//
// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc)
// }, (e) => {
//     console.log('Unable to save todo', e)
// })