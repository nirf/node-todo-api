let {User} = require('./../models/user')

let authenticate = (req, res, next) => {
    let token = req.header('x-auth')

    return User.findByToken(token).then((user) => {
        if (!user) {
            //explicit goto the catch block
            return Promise.reject()
        }

        req.user = user
        req.token = token
        next()
    }).catch((e) => {
         res.status(401).send()
    })
}

module.exports = {authenticate}