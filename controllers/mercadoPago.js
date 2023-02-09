const mercadopago = require('mercadopago');
const moment = require('moment')
const { db } = require('../dbServer');
const { getUserInfoFromDB } = require('../utils');

const back_url = process.env.ENV == 'dev' ? "http://localhost:5173/social-media" : "https://incopy.netlify.app/social-media"

const notificationPlan = (req, res) => {
    console.log(`<--- nueva ${new Date().getMinutes()} --->`);
    const data = req.body;
    console.log(data);
    res.status(200).send(data)
}


module.exports = {
    // createPlan,
    notificationPlan,
    // createSuscription
}