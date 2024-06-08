const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)


beforeEach(async () => {
  await User.deleteMany({})
})

describe('Validate username/password', () => {

  test('Test valid username/password', async () => {
    user = {
      username: "jjoyce",
      name: "James Joyce",
      password: "riverrun"
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await helper.usersInDb()
    const usernames = users.map(user => user.username)
    assert(usernames.includes('jjoyce'))
  })

 test('Test invalid username', async () => {
    user = {
      username: "jj",
      name: "James Joyce",
      password: "riverrun"
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })

 test('Test invalid password', async () => {
    user = {
      username: "jjoyce",
      name: "James Joyce",
      password: "a"
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
