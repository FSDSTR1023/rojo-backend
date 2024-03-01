const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user.model.js')
const USERS = [
  {
    name: 'Ana',
    lastName: 'García',
    email: 'ana@example.com',
    password: 'contraseña123',
    country: 'Spain',
    description: 'Chef aficionada amante de la cocina mediterránea.',
    userName: 'anaChef123',
    imageUrl:
      'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://ejemplo.com/anaVideo.mp4',
    recipes: [],
    favRecipes: [],
    following: [],
    followers: [],
    createdAt: '2023-01-15T08:00:00.000Z',
  },
  {
    name: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'johnny456',
    country: 'United States',
    description: 'Foodie and aspiring chef exploring global cuisines.',
    userName: 'johnDoe',
    imageUrl:
      'https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    videoUrl: 'https://ejemplo.com/johnVideo.mp4',
    recipes: [],
    favRecipes: [],
    following: [],
    followers: [],
    createdAt: '2023-02-20T10:30:00.000Z',
  },
]

describe('Users', () => {
  const mongoServer = new MongoMemoryServer()
  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await mongoServer.start()
    await mongoose.connect(mongoServer.getUri())
    await User.create(USERS.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, 10) })))
  })
  afterAll(async () => {
    await mongoServer.stop()
  })
  it('/user has to return status code 200', async () => {
    const response = await request(app).get('/user')
    expect(response.statusCode).toBe(200)
  })
  it('/user has to return all users', async () => {
    const response = await request(app).get('/user')
    expect(response.body.length).toBe(USERS.length)
  })
  it('/user/login has to return a JWT', async () => {
    const msg = {
      email: USERS[0].email,
      password: USERS[0].password,
    }
    const response = await request(app).post('/user/login').send(msg)
    expect(response.statusCode).toBe(200)
  })
})
