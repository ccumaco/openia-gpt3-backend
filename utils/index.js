const bcrypt = require('bcrypt');
const fs = require('fs');
const http = require('http');
const cheerio = require('cheerio');

const hashedPassword = async (userPassword) => {
  const saltRounds = 10;
  const password = await bcrypt.hash(userPassword, saltRounds);
  return password;
}



// Establecer la URL de búsqueda
const searchUrl = 'http://www.google.com/search?q=paisaje';

// Realizar la solicitud HTTP y analizar la respuesta
const searchImage = () => http.get(searchUrl, (response) => {
  let data = '';
  response.on('data', (chunk) => {
    data += chunk;
  });
  response.on('end', () => {
    const $ = cheerio.load(data);
    // Encontrar la primera imagen y extraer la URL de la imagen
    const imgSrc = $('img').first().attr('src');
    // Descargar la imagen y guardarla en un archivo
    const file = fs.createWriteStream('imagen.jpg');
    http.get(imgSrc, (response) => {
      response.pipe(file);
    });
  });
}).on('error', (error) => {
  console.error(error);
});

  
  module.exports = {
    hashedPassword,
    searchImage
  };