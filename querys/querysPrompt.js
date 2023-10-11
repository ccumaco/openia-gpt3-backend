
const generateHashtag = (generateHashtag = false, hastags, countHashtag) => {
    if (generateHashtag && hastags.length == 0) {
        return `y genera ${countHashtag} hashtags apropiados para el tema`
    } else if (generateHashtag && hastags.length > 0) {
        return `y genera ${countHashtag} hashtags apropiados para el tema`
    } else if(!generateHashtag && hastags.length > 0){
        return `y agrega estos hashtag ${hastags} al final`
    }
    return ''
}
const generateSeoWords = (generateSeoKeyWords = false, keyWords) => {
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
const likeEmail = () => {
    return 'esto es un correo';
}
const getLanguage = (language) => {
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

const softMessage = (soft) => {
    switch (soft) {
        case 'Creativa':
            return 1
        case 'Balanzeada':
            return 0.5
        case 'Precisa':
            return 0
        default:
            return 0
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

const explainLike = (whatToDo) => {
    return `${whatToDo} sobre este articulo,`
}
const getTitlePrompt = (title) => {
    return `crea esto como un ${title}.`
}
const addImages = (flag) => {
    if (flag) {
        return `agrega imagenes buscadas en web sobre el tema;`
    }
}

const validateIfIsQuery = (prompt) => {
    const QUERY = 'SELECT * FROM productos WHERE id = "id proporcionado" OR nombre = "nombre proporcionado";';
    const elseCondition = "sino no solo responde la pregunta amigablemente, recuerda que esto es solo contexto que te doy.";
    const baseCondition =  `si este texto contiene preguntas relacionadas a productos dame un ejemplo de una consulta SQL con la siguiente base cambiando lo que en las comillas por el producto: `;
    const response = ` (${baseCondition} ${QUERY} ${elseCondition}) `;
    return response
}

module.exports = {
    generateHashtag,
    getLanguage,
    softMessage,
    maxLengthText,
    getMaxResponses,
    getTitlePrompt,
    generateSeoWords,
    generateLikeHTML,
    likeEmail,
    addImages,
    explainLike,
    validateIfIsQuery
};