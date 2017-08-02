const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 1,
        index: {
            unique: true
        },
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
})
//overidding instance method
UserSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject()
    return _.pick(user, ['_id', 'email'])
}
//adding instance methods
UserSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString()

    user.tokens.push({access, token})
    //return the token in the promise - without return the token is not defined
    return user.save().then(() => {
        return token
    })
}
//adding static method
UserSchema.statics.findByToken = function (token) {
    let User = this
    let decoded

    try {
        decoded = jwt.verify(token, 'secret')
    } catch (e) {
        return Promise.reject()
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }).then((user) => {
        return user
    }).catch((e) => {
        return Promise.reject()
    })
}


let User = mongoose.model('User', UserSchema)

module.exports = {
    User
}