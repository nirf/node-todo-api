const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

//going to run before each test and will
//move to the next one only when we call done
beforeEach(populateUsers)
beforeEach(populateTodos)

describe('SANITY', () => {
    it('should expect 1 to 1', () => {
        expect(1).toBe(1)
    })
})
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Some todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .expect((res) => {
                expect(res.errors).toNotExist()
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
            })
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 for non object ids', (done) => {
        let id = '1234'
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        let hexId = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text)
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist()
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if object id is invalid', (done) => {
        let id = '1234'
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString()
        let todoUpdate = {
            text: 'updated text',
            completed: true
        }
        request(app)
            .patch(`/todos/${hexId}`)
            .send(todoUpdate)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todoUpdate.text)
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeA('number')
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(todoUpdate.text)
                    expect(todo.completed).toBe(true)
                    expect(todo.completedAt).toBeA('number')
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString()
        let todoUpdate = {
            completed: false,
            text: 'bla'
        }
        request(app)
            .patch(`/todos/${hexId}`)
            .expect(200)
            .send(todoUpdate)
            .expect((res) => {
                expect(res.body.todo.completedAt).toNotExist()
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.text).toBe(todoUpdate.text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.findById(hexId).then((todo) => {
                    expect(res.body.todo.completedAt).toNotExist()
                    expect(todo.completed).toBe(false)
                    expect(todo.text).toBe(todoUpdate.text)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end((done))
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'sldkjfsdlkjf@gmail.com'
        var password = '123456'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
                expect(res.body._id).toExist()
                expect(res.body.email).toBe(email)
            })
            .end((err) => {
                if (err) {
                    done(err)
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist()
                    expect(user.password).toNotBe(password)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should return validation errors if request invalid email', (done) => {
        request(app)
            .post('/users')
            .send({
                email: '1',
                password: '123456'
            })
            .expect(400)
            .end(done)
    })

    it('should return validation errors if request invalid password', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'bla@gmail.com',
                password: '123'
            })
            .expect(400)
            .end(done)
    })

    it('should not create a user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: '123456'
            })
            .expect(400)
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password

            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'

            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err,  res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))

            })
    })
})