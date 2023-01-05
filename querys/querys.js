
const generateHastag = (generateHastag = false, hastags) => {
    if (generateHastag && hastags.length == 0) {
        console.log("primero");
        return 'y genera unos hashtag apropiados para el tema'
    } else if (hastags) {
        console.log("segundo");
        return `y agrega estos hashtag ${hastags}`
    }
    console.log("tercero", generateHastag, hastags.length);
    return ''
}
const getLenguaje = (language) => {
    if (language) {
        return `esta respuesta la quiero en ${language}`
    }
    return ''
}
const maxLengthText = (maxLength) => {
    if (maxLength) {
        return `Con una longitud de ${maxLength} caracteres`
    }
    return ''
}

const softMessaje = (soft) => {
    if (soft) {
        return `y con un tono ${soft}`
    }
}
module.exports = { generateHastag, getLenguaje, softMessaje, maxLengthText };