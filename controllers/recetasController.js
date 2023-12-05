const Recetas = require('../models/recetas.model')

async function createRecetas(req, res){
    Recetas.create(req.body)
    .then((recetas) => {
        console.log('recetas creadas', recetas)
        res.status(200).json(recetas)
    })
    .catch((err) => {
        console.log(err, 'error y que intentes denuevo por que algo fue mal')
        res.status(400).json(err)
    })
}

async function getAllRecetas(req, res){
    Recetas.find()
    .then((recetas) => {
        console.log('all recetas found', recetas)
        res.status(200).json(recetas)
    })
    .catch((err) => {
        console.log(err, 'all recetas not found, try again')
        res.status(400).json(err)
    })
}


module.exports = { createRecetas, getAllRecetas }