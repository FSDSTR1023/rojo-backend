const element = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  const element = array[randomIndex]
  return element
}

const elements = (array, n) => {
  if (n >= array.length) return array

  const elements = []
  const numbers = []

  while (elements.length < n) {
    const randomIndex = Math.floor(Math.random() * array.length)

    if (!numbers.includes(randomIndex)) {
      numbers.push(randomIndex)
      elements.push(array[randomIndex])
    }
  }

  return elements
}

// Notesé que también en este caso `min` será incluido y `max` excluido
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

// Ahora, tanto el valor mínimo como el máximo están incluidos en el resultado.
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  element,
  elements,
  getRandomInt,
  getRandomIntInclusive,
}
