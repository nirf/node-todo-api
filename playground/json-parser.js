const endpoints = require('./endpoint.json')
const fs = require('fs')

let keys = Object.keys(endpoints.paths)

keys.forEach(key => {
    // console.log(key)
})


let content = fs.readFileSync('/Users/nir/w2v/test/legacy-endpoints.txt')
console.log(content)



