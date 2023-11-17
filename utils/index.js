const bcrypt = require('bcrypt');
// const fs = require('fs');
const http = require('http');
const cheerio = require('cheerio');

const hashedPassword = async (userPassword) => {
  const saltRounds = 10;
  const password = await bcrypt.hash(userPassword, saltRounds);
  return password;
}

const joinWithDash = (text) => {
  if (!text) return '';
  text = text.trim();
  return text.split(' ').join('-');
}

  
  module.exports = {
    hashedPassword,
    joinWithDash
  };