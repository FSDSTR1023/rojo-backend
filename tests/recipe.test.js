const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Recipe = require('../models/recipe.model.js')
const User = require('../models/user.model.js')

const RECIPES = [
  {
    title: 'Ensalada de Garbanzos',
    ingredients: [
      'Garbanzos cocidos',
      'Pimiento rojo',
      'Pimiento verde',
      'Cebolla morada',
      'Pepino',
      'Perejil fresco',
      'Aceite de oliva',
      'Vinagre',
      'Sal',
      'Pimienta',
    ],
    preparation: [
      {
        title: 'Paso 1: Preparar los Garbanzos',
        description: 'Enjuaga y escurre los garbanzos cocidos. Resérvalos en un bol grande.',
      },
      {
        title: 'Paso 2: Cortar Vegetales',
        description:
          'Pica finamente el pimiento rojo, el pimiento verde, la cebolla morada y el pepino. Añade al bol con los garbanzos.',
      },
      {
        title: 'Paso 3: Agregar Perejil y Aliño',
        description:
          'Pica el perejil fresco y añádelo a la ensalada. Prepara un aliño mezclando aceite de oliva, vinagre, sal y pimienta. Vierte sobre la ensalada y mezcla bien.',
      },
      {
        title: 'Paso 4: Refrigerar y Servir',
        description:
          'Refrigera la ensalada durante al menos 30 minutos antes de servir para que los sabores se mezclen. Sirve fría como plato principal o acompañamiento.',
      },
    ],
    difficulty: 'EASY',
    preparationTime: 'FAST',
    imageUrl: 'https://www.paulinacocina.net/wp-content/uploads/2022/05/ensalada-de-garbanzos-receta-800x534.jpg',
    categories: ['Healthy', 'Vegetarian', 'Vegan', 'High Protein', 'Quick Meals'],
    rating: 0,
    opinions: [],
    author: '657b18ed4bef22d724acd501',
  },
  {
    title: 'Ensalada de Quinoa y Vegetales Asados',
    ingredients: [
      'Quinoa',
      'Calabacín',
      'Pimiento rojo',
      'Berenjena',
      'Cebolla',
      'Tomates cherry',
      'Aceite de oliva',
      'Hierbas frescas (tomillo, romero)',
      'Sal',
      'Pimienta',
    ],
    preparation: [
      {
        title: 'Paso 1: Cocinar la Quinoa',
        description: 'Cocina la quinoa según las instrucciones del paquete.',
      },
      {
        title: 'Paso 2: Asar Vegetales',
        description:
          'Corta los vegetales en trozos, mézclalos con aceite y hierbas. Asa en el horno hasta que estén tiernos.',
      },
      {
        title: 'Paso 3: Mezclar Ingredientes',
        description: 'Mezcla la quinoa cocida con los vegetales asados.',
      },
      {
        title: 'Paso 4: Aliñar y Refrigerar',
        description:
          'Aliña la ensalada con aceite de oliva, sal y pimienta. Refrigera por al menos 1 hora antes de servir.',
      },
    ],
    difficulty: 'EASY',
    preparationTime: 'MODERATE',
    imageUrl: 'https://www.recetaslider.cl/wp-content/uploads/2021/06/principal_5cb62f13ceb97.jpg',
    categories: ['Healthy', 'Vegetarian', 'Vegan', 'High Protein', 'Quick Meals'],
    rating: 0,
    opinions: [],
    author: '657b18ed4bef22d724acd501',
  },
]

const USER = [
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
]

const cookies = []

describe('Recipes', () => {
  const mongoServer = new MongoMemoryServer()
  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await mongoServer.start()
    await mongoose.connect(mongoServer.getUri())
    const createdUser = await User.create(
      USER.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, 10) })),
    )
    cookies.push(`token=${jwt.sign({ id: createdUser[0]._id }, process.env.JWT_KEY)}`)
    await Recipe.create(RECIPES)
  })
  afterAll(async () => {
    await mongoServer.stop()
  })

  // TESTS

  //GET

  it('GET/recipe has to return status code 200', async () => {
    const response = await request(app).get('/recipe')
    expect(response.statusCode).toBe(200)
  })
  //No funciona porque body devuelve un array vacio, revisar los filtros...
  it('GET/recipe has to return all recipes', async () => {
    const response = await request(app).get('/recipe')
    expect(response.body.length).toBe(RECIPES.length)
  })
  it('GET/recipe/:id has to return status code 200', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const response = await request(app).get(`/recipe/${id}`)
    expect(response.statusCode).toBe(200)
  })
  it('GET/recipe/:id has to return the correct recipe', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const response = await request(app)
      .get(`/recipe/${id}`)
      .then((res) => res.body)
    expect(response.title).toEqual(RECIPES[0].title)
  })
  it('GET/recipe/:id has to return 404 when recipe not found', async () => {
    const response = await request(app).get(`/recipe/123`)
    expect(response.statusCode).toBe(404)
  })

  // POST

  it('POST/recipe has to create a new recipe', async () => {
    const newRecipe = {
      title: 'Ensalada de Espinacas y Fresas',
      ingredients: [
        'Espinacas frescas',
        'Fresas',
        'Queso de cabra',
        'Nueces',
        'Cebolla roja',
        'Aceite de oliva',
        'Vinagre balsámico',
        'Sal',
        'Pimienta',
      ],
      preparation: [
        {
          title: 'Paso 1: Preparar Ingredientes',
          description:
            'Lava y seca las espinacas y las fresas. Corta las fresas en rodajas y la cebolla en juliana. Desmenuza el queso de cabra.',
        },
        {
          title: 'Paso 2: Mezclar Ingredientes',
          description: 'Combina las espinacas, fresas, cebolla, queso de cabra y nueces en un bol grande.',
        },
        {
          title: 'Paso 3: Aliñar y Servir',
          description:
            'Prepara un aliño con aceite de oliva, vinagre balsámico, sal y pimienta. Aliña la ensalada y sirve.',
        },
      ],
      difficulty: 'EASY',
      preparationTime: 'FAST',
      imageUrl: 'https://s1.eestatic.com/2021/03/02/cocinillas/recetas/ensaladas/562955653_174333694_1706x960.jpg',
      categories: ['Healthy', 'Vegetarian', 'Quick Meals'],
      rating: 0,
      opinions: [],
      author: '657b18ed4bef22d724acd501',
    }
    const response = await request(app).post('/recipe').send(newRecipe).set('Cookie', cookies)
    expect(response.statusCode).toBe(201)
    expect(response.body.title).toBe(newRecipe.title)
  })
  it('POST/recipe has to return 400 if recipe is not well provided', async () => {
    const newRecipe = {
      title: 'Tortilla',
      ingredients: ['Patatas', 'Cebolla'],
    }
    const response = await request(app).post('/recipe').send(newRecipe).set('Cookie', cookies)
    expect(response.statusCode).toBe(400)
  })

  // PUT

  it('PUT/recipe/:id has to update recipe', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const updatedRecipe = {
      difficulty: 'EASY',
    }
    const response = await request(app).put(`/recipe/${id}`).send(updatedRecipe).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.body._id).toStrictEqual(id)
    expect(response.body.difficulty).toBe(updatedRecipe.difficulty)
  })

  // PATCH

  it('PATCH/recipe/opinion/add/:id has to add a new opinion', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const newOpinion = {
      text: 'Very good',
      rating: 5,
      user: '65b6151edc7182f6a4bb2924',
    }
    const response = await request(app).patch(`/recipe/opinion/add/${id}`).send(newOpinion).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.body.updatedOpinion.text).toBe(newOpinion.text)
  })
  it('PATCH/recipe/opinion/add/:id has to calculate the new rating', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const newOpinion = {
      rating: 5,
    }
    const response = await request(app).patch(`/recipe/opinion/add/${id}`).send(newOpinion).set('Cookie', cookies)
    const updatedRecipeResponse = await request(app).get(`/recipe/${id}`)
    const updatedRecipe = updatedRecipeResponse.body
    expect(response.body.updatedRating).toBe(updatedRecipe.rating)
  })

  it('PATCH/recipe/opinion/delete/:id should delete an existing opinion', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const newOpinion = {
      text: 'test',
      rating: 5,
    }
    const testResponse = await request(app).patch(`/recipe/opinion/add/${id}`).send(newOpinion).set('Cookie', cookies)
    const opinionId = testResponse.body.updatedOpinion._id
    const deletedOpinion = {
      opinionId: opinionId,
    }
    const response = await request(app)
      .patch(`/recipe/opinion/delete/${id}`)
      .send(deletedOpinion)
      .set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
  })

  it('PATCH/recipe/opinion/delete/:id has to calculate the new rating', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const newOpinion = {
      rating: 5,
    }
    const addResponse = await request(app).patch(`/recipe/opinion/add/${id}`).send(newOpinion).set('Cookie', cookies)
    const opinionId = addResponse.body.updatedOpinion._id
    const deletedOpinion = {
      opinionId: opinionId,
    }
    const response = await request(app)
      .patch(`/recipe/opinion/delete/${id}`)
      .send(deletedOpinion)
      .set('Cookie', cookies)
    const updatedRecipeResponse = await request(app).get(`/recipe/${id}`)
    const updatedRecipe = updatedRecipeResponse.body
    expect(response.body.updatedRating).toBe(updatedRecipe.rating)
  })

  it('PATCH/recipe/opinion/update/:id should update an existing opinion', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const newOpinion = {
      text: 'test',
      rating: 5,
    }
    const testResponse = await request(app).patch(`/recipe/opinion/add/${id}`).send(newOpinion).set('Cookie', cookies)
    const opinionId = testResponse.body.updatedOpinion._id
    const updateOpinion = {
      text: 'updated opinion',
      rating: 3,
      opinionId: opinionId,
    }
    const response = await request(app).patch(`/recipe/opinion/update/${id}`).send(updateOpinion).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.body.updatedOpinion.text).toBe(updateOpinion.text)
  })
  it('PATCH/recipe/opinion/update/:id has to calculate the new rating', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()
    const newOpinion = {
      rating: 5,
    }
    const addResponse = await request(app).patch(`/recipe/opinion/add/${id}`).send(newOpinion).set('Cookie', cookies)
    const opinionId = addResponse.body.updatedOpinion._id
    const updateOpinion = {
      text: 'updated opinion',
      rating: 3,
      opinionId: opinionId,
    }
    const response = await request(app).patch(`/recipe/opinion/update/${id}`).send(updateOpinion).set('Cookie', cookies)
    const updatedRecipeResponse = await request(app).get(`/recipe/${id}`)
    const updatedRecipe = updatedRecipeResponse.body
    expect(response.body.updatedRating).toBe(updatedRecipe.rating)
  })

  // DELETE

  it('DELETE/recipe/:id has to delete the recipe', async () => {
    const { _id } = await Recipe.findOne({ title: RECIPES[0].title })
    const id = _id.toString()

    const response = await request(app).delete(`/recipe/${id}`).set('Cookie', cookies)
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(RECIPES[0].title)
  })
  it('DELETE/recipe/:id has to return 404 when the recipe id is wrong', async () => {
    const response = await request(app).delete('/recipe/123').set('Cookie', cookies)
    expect(response.statusCode).toBe(404)
  })
})
