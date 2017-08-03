const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

UserSchema.methods.removeToken = function (token) {
    let user = this
    return user.update({
        $pull: {
            tokens: {token}
        }
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

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject()
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err || res === false) {
                    reject()
                }
                if (res) {
                    resolve(user)
                }
            })
        })
    })
}

UserSchema.pre('save', function (next) {
    let user = this
    if (user.isModified('password')) {
        bcrypt.genSalt(8, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

let User = mongoose.model('User', UserSchema)

module.exports = {
    User
}