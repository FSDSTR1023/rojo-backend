const { describe, it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const deleteData = require('../mocks/DeleteData')
const importData = require('../mocks/ImportData')

describe('Users', () => {
  const mongoServer = new MongoMemoryServer()
  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await mongoServer.start()
    await mongoose.connect(mongoServer.getUri())
  })
  afterAll(async () => {
    await mongoServer.stop()
  })
  beforeEach(async () => {
    await deleteData()
    await importData()
  })
  it('has to return status code 200', async () => {
    const response = await request(app).get('/user')
    expect(response.statusCode).toBe(200)
  })
  it('has to return all users', async () => {
    const response = await request(app).get('/user')
    expect(response.body.length).toBe(9)
  })
})
