const Rutinas = require('../models/rutinas.model');

async function createRutinas(req, res) {
  Rutinas.create(req.body)
    .then((rutinas) => {
      console.log('Rutinas created', rutinas);
      res.status(200).json(rutinas);
    })
    .catch((err) => {
      console.log(err, ' <---- error try again something went wrong');
      res.status(400).json(err);
    });
}

async function getAllRutinas(req, res) {
  Rutinas.find()
    .then((rutinas) => {
      console.log('rutinas found', rutinas);
      res.status(200).json(rutinas);
    })
    .catch((err) => {
      console.log(err, ' <---- error try again something went wrong');
      res.status(400).json(err);
    });
}

module.exports = { getAllRutinas, createRutinas };