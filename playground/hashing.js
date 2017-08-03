//SHA 256
const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = 'nirfiegelshtein'

bcrypt.genSalt(8, (err, salt) => {
    bcrypt.hash(password, salt,  (err,  hash) => {
        console.log(hash)
    })
})

let hashedPassword = '$2a$16$DypRMBTK2IR4M1bWFDP70uA0OrgBzFNhe0ry7Lc9S8nP/rl52cCM.'

bcrypt.compare(password, hashedPassword, (err,  res) => {
    console.log(res)
})
// let token = jwt.sign({id: 10}, 'kaki')
// console.log(token)
// let deconde = jwt.verify(token, 'kaki')
// console.log(deconde)

// let message = 'I am user number 39'
// let hash = SHA256(message).toString()
//
// console.log(message, hash)
//
//
// let data = {
//     id: 4
// }
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some salt secret').toString()
// }
//
// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'some salt secret').toString()
//
// if (resultHash === token.hash) {
//     console.log('equals')
// } else {
//     console.log('not equals')
// }