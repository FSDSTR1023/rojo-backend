const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
const cookies = []

describe('Users', () => {
  const mongoServer = new MongoMemoryServer()
  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await mongoServer.start()
    await mongoose.connect(mongoServer.getUri())
    const createdUsers = await User.create(
      USERS.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, 10) })),
    )
    cookies.push(`token=${jwt.sign({ id: createdUsers[0]._id }, process.env.JWT_KEY)}`)
  })
  afterAll(async () => {
    await mongoServer.stop()
  })

  // TESTS

  // GET
  it('GET/user has to return status code 200', async () => {
    const response = await request(app).get('/user').set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
  })

  it('GET/user has to return all users', async () => {
    const response = await request(app).get('/user').set('Cookie', cookies)
    expect(response.body.length).toBe(USERS.length)
  })

  it('GET/user/checkAuthToken has to return status code 200', async () => {
    const response = await request(app).get('/user/authWithToken').set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
  })

  it('GET/user/checkAuthToken has to return status code 401 when no token is provided', async () => {
    const response = await request(app).get('/user/authWithToken')
    expect(response.statusCode).toBe(401)
  })

  it('GET/user/checkAuthToken has to return the correct name', async () => {
    const response = await request(app).get('/user/authWithToken').set('Cookie', cookies)
    expect(response.body.name).toBe(USERS[0].name)
  })

  it('GET/user/:id has to return status code 200', async () => {
    const { id } = jwt.verify(cookies[0].split(';')[0].split('=')[1], process.env.JWT_KEY)

    const response = await request(app).get(`/user/${id}`).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
  })

  it('GET/user/:id has to return status code 404 if user does not exist', async () => {
    const response = await request(app).get(`/user/123`).set('Cookie', cookies)
    expect(response.statusCode).toBe(404)
  })

  // POST
  it('POST/user has to create a new user', async () => {
    const newUser = {
      name: 'Elena',
      lastName: 'Martinez',
      email: 'elena@example.com',
      password: 'clave789',
      country: 'Mexico',
      description: 'Apasionada por la cocina tradicional mexicana.',
      userName: 'elenitaCocina',
      imageUrl:
        'https://images.pexels.com/photos/678783/pexels-photo-678783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      videoUrl: 'https://ejemplo.com/elenaVideo.mp4',
      recipes: [],
      favRecipes: [],
      following: [],
      followers: [],
      createdAt: '2023-03-05T12:45:00.000Z',
    }

    const response = await request(app).post('/user').send(newUser)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newUser.name)
  })

  it('POST/user has to return 400 if user is not well provided', async () => {
    const newUser = {
      name: 'Elena',
      lastName: 'Martinez',
    }

    const response = await request(app).post('/user').send(newUser)
    expect(response.statusCode).toBe(400)
  })

  it('POST/user/login has to return a JWT', async () => {
    const msg = {
      email: USERS[0].email,
      password: USERS[0].password,
    }
    const response = await request(app).post('/user/login').send(msg)
    expect(response.statusCode).toBe(200)
    expect(response.headers['set-cookie'][0]).toMatch(/token=.+; HttpOnly/)
  })

  it('POST/user/login has to return status code 401 when wrong user is logged in', async () => {
    const msg = {
      email: USERS[0].email,
      password: USERS[1].password,
    }
    const response = await request(app).post('/user/login').send(msg)
    expect(response.statusCode).toBe(401)
  })

  it('POST/user/logout has to clear the cookie', async () => {
    const response = await request(app).post('/user/logout').set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.headers['set-cookie'][0]).toMatch('')
  })

  // PUT
  it('PUT/user has to create a new user', async () => {
    const { id } = jwt.verify(cookies[0].split(';')[0].split('=')[1], process.env.JWT_KEY)
    const newUser = {
      lastName: 'García',
    }

    const response = await request(app).put(`/user/${id}`).send(newUser).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe(USERS[0].name)
    expect(response.body.lastName).toBe(newUser.lastName)
  })

  // DELETE
  it('DELETE/user/:id has to delete the user', async () => {
    const { id } = jwt.verify(cookies[0].split(';')[0].split('=')[1], process.env.JWT_KEY)

    const response = await request(app).delete(`/user/${id}`).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe(USERS[0].name)
  })

  it('DELETE/user/:id has to return status code 404 id wrong user id is provided', async () => {
    const response = await request(app).delete(`/user/123`).set('Cookie', cookies)
    expect(response.statusCode).toBe(404)
  })
})
