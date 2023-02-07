
const generateHastag = (generateHastag = false, hastags, countHashtag) => {
    if (generateHastag && hastags.length == 0) {
        return `y genera ${countHashtag} hashtags apropiados para el tema`
    } else if (generateHastag && hastags.length > 0) {
        return `y genera ${countHashtag} hashtags apropiados para el tema`
    } else if(!generateHastag && hastags.length > 0){
        return `y agrega estos hashtag ${hastags} al final`
    }
    return ''
}
const generateSeoWods = (generateSeoKeyWords = false, keyWords) => {
    if (generateSeoKeyWords && keyWords.length == 0) {
        return `utiliza las palabras de SEO mas apropiadas para el articulo`
    } else if (generateSeoKeyWords && keyWords.length > 0) {
        return `utiliza las palabras de SEO mas apropiadas para el articulo`
    } else if(!generateSeoKeyWords && keyWords.length > 0){
        return `Utiliza estas palabras para el SEO ${keyWords}`
    }
    return ''
}
const generateLikeHTML = () => {
    return 'generalo como HTML';
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
const getTitlePrompt = (title) => {
    return `crea esto como un ${title};`
}
module.exports = {
    generateHastag,
    getLenguaje,
    softMessaje,
    maxLengthText,
    getMaxResponses,
    getTitlePrompt,
    generateSeoWods,
    generateLikeHTML
};