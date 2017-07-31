var mongoose = require('mongoose')

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

module.exports = {
    User
}