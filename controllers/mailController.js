const SibApiV3Sdk = require('sib-api-v3-sdk')
const { apiKey } = require('../config/brevo')
const Recipe = require('../models/recipe.model')
const User = require('../models/user.model')
const htmlContent = require('../utils/template')

const sendEmail = async (to, subject, textContent) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  const sender = {
    email: 'bratinandrea@gmail.com',
    name: 'Andrea Bratin',
  }
  const receivers = [
    {
      email: to,
    },
  ]
  try {
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      textContent,
      //htmlContent,
    })
    return sendEmail
  } catch (error) {
    console.log(error)
    throw new Error('Error al enviar el correo electrónico')
  }
}

async function sendEmailToRecipeCreator(req, recipeData) {
  try {
    // Obtener el ID del autor de la receta
    const authorId = req.body.author
    // Verificar si se proporcionó un ID de autor válido
    if (!authorId) {
      throw new Error('ID del autor no proporcionado')
    }
    // Buscar al usuario por su ID
    const user = await User.findById(authorId)
    // Verificar si se encontró al usuario
    if (!user) {
      throw new Error('No se encontró al usuario con el ID proporcionado')
    }

    const userEmail = user.email
    const emailContent = `¡Hola ${user.name}!\n\nSe ha creado una nueva receta en nuestra plataforma.\n\nTítulo: ${
      recipeData.title
    }\nCategorías: ${recipeData.categories.join(
      ', ',
    )}\n\n¡Esperamos que la disfrutes!\n\nSaludos,\nEquipo de Health App`
    await sendEmail(userEmail, 'Nueva Receta Creada', emailContent)
    console.log('Correo electrónico enviado al creador de la receta')
  } catch (err) {
    console.error('Error al enviar el correo electrónico:', err.message)
  }
}

module.exports = {
  sendEmail,
  sendEmailToRecipeCreator,
}
