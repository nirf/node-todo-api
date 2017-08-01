const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second tests todo',
    completed: true,
    completedAt: 333
}]

//going to run before each test and will
//move to the next one only when we call done
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
})
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Some todo text'

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
        var hexId = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 for non object ids', (done) => {
        var id = '1234'
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexId = todos[1]._id.toHexString()
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
        var hexId = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if object id is invalid', (done) => {
        var id = '1234'
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString()
        var todoUpdate = {
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
        var hexId = todos[1]._id.toHexString()
        var todoUpdate = {
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