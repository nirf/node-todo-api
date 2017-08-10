let f1 = function () {
    return new Promise((resolve, reject) => {
        reject('rejected')
    })
}

let f2 = function () {
    return new Promise((resolve, reject) => {
        resolve('resolve')
    })
}

let f3 = function () {
    return new Promise((resolve, reject) => {
        throw new Error('Error')
    })
}

f1().then((res) => {
    console.log('f1' + res)
}, (err) => {
    console.log('f1' + err)
})

f1().then((res) => {
    console.log('f1' + res)
}).catch((e)  => {
    console.log('f1' + e)
})

f2().then((res) => {
    console.log('f2' + res)
}, (err) => {
    console.log('f2' + err)
})

f2().then((res) => {
    console.log('f2' + res)
}).catch((e)  => {
    console.log('f2' + e)
})

f3().then((res) => {
    console.log('f3' + res)
}, (err) => {
    console.log('f3' + err)
})

f3().then((res) => {
    console.log('f3' + res)
}).catch((e)  => {
    console.log('f3' + e)
})