
const generateHastag = (generateHastag = false, hastags, countHashtag) => {
    if (generateHastag && hastags.length == 0) {
        console.log("primero");
        return `y genera ${countHashtag} hashtags apropiados para el tema`
    } else if (generateHastag && hastags.length > 0) {
        return `y genera ${countHashtag} hashtags apropiados para el tema`
    } else if(!generateHastag && hastags.length > 0){
        return `y agrega estos hashtag ${hastags} al final`
    }
    return ''
}
const getLenguaje = (language) => {
    if (language) {
        return `esta respuesta la quiero en ${language};`
    }
    return ''
}
const maxLengthText = (maxLength) => {
    if (maxLength) {
        return `con una cantidad igual o menor a ${maxLength} caracteres;`
    }
    return ''
}

const softMessaje = (soft) => {
    if (soft) {
        return ` con un tono ${soft};`
    }
}

const getMaxResponses = (maxResponses) => {
    if (maxResponses <= 0) {
        return 1;
    } else if (maxResponses >= 3) {
        return 3
    }
    return maxResponses
}
module.exports = { generateHastag, getLenguaje, softMessaje, maxLengthText, getMaxResponses };