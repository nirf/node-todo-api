const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

//going to run before each test and will
//move to the next one only when we call done
beforeEach((done) => {
    Todo.remove({}).then(() => done())
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
                Todo.find().then((todos) => {
                    console.log(todos.length)
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
                    console.log(todos.length)
                    expect(todos.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})