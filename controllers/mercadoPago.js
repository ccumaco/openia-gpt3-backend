const mercadopago = require('mercadopago');
const moment = require('moment')
const { db } = require('../dbServer');
const { getUserInfoFromDB } = require('../utils');

const back_url = process.env.ENV == 'dev' ? "http://localhost:5173/social-media" : "https://incopy.netlify.app/social-media"

const notificationPlan = (req, res) => {
    console.log(`<--- nueva ${new Date().getMinutes()} --->`);
    const data = req.body;
    console.log(data);
    console.log(req.headers,' headers');
    res.status(200).send(data)
}
const saveTransaction = (user) => {
    const sql = `'INSERT INTO transactions (
      user_id,
      title,
      unit_price,
      quantity,
      reason,
      frequency,
      frequency_type,
      billing_day,
      transaction_amount,
      currency_id)
      VALUES (?,?,?,?,?,?,?,?,?,?)';`;
    const values = [
      user.userId,
      'Plan Mensual Incopy',
      37500,
      1,
      1,
      'months',
      new Date().getDate(),
      37500,
      'COP'
    ];
    return new Promise((resolve, reject) => {
      db.query(query, [userEmail], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results[0]);
      });
    });
  }
const createSuscription = (req, res) => {
    var payment_data = {
        transaction_amount: Number(req.body.transactionAmount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.paymentMethodId,
        issuer_id: req.body.issuer,
        payer: {
          email: req.body.email,
          identification: {
            type: req.body.docType,
            number: req.body.docNumber
          }
        }
      };
      
      mercadopago.payment.save(payment_data)
        .then(function(response) {
          res.status(response.status).json({
            status: response.body.status,
            status_detail: response.body.status_detail,
            id: response.body.id
          });
        })
        .catch(function(error) {
          res.status(response.status).send(error);
        });
}


module.exports = {
    // createPlan,
    notificationPlan,
    createSuscription
}