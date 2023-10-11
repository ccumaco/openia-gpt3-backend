const clearPromptSql = (prompt) => {
    const selectIndex = prompt.indexOf('SELECT');
    if (selectIndex === -1) {
      return null;
    }
    const resultado = prompt.substring(selectIndex); 
    return resultado.trim();
}

module.exports = {
    clearPromptSql
}