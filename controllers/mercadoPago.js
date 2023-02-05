const mercadopago = require('mercadopago');
const moment = require('moment')
const { db } = require('../dbServer');
const { getUserInfoFromDB } = require('../utils');

const back_url = process.env.ENV == 'dev' ? "http://localhost:5173/social-media" : "https://incopy.netlify.app/social-media"
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
// const createPlan = async (req, res) => {
//     const { userEmail } = req.body;
    
//     mercadopago.configure({
//         access_token: process.env.TOKEN_VENDOR
//     });

//     const items = {
//         items: [
//           {
//             title: "Plan Mensual Incopy",
//             unit_price: 37500,
//             quantity: 1
//           }
//         ],
//         reason: "Acceder a los servicios de incopy mes a mes con una prueba gratuita de 15 dias",
//         auto_recurring: {
//           frequency: 1,
//           frequency_type: "months",
//           billing_day: new Date().getDate(),
//           billing_day_proportional: true,
//           free_trial: {
//             frequency: 15,
//             frequency_type: "days"
//           },
//           transaction_amount: 37500,
//           currency_id: "COP"
//         },        
//         back_urls: {
//             success: back_url,
//             pending: back_url,
//             failure: back_url,
//         },
//       }

//     mercadopago.preferences.create(items)
//         .then(async response => {
//             console.log('todo paso bien', response.body.back_urls);
//             res.json(response.body)
//         })
//         .catch(error => {
//             console.error(error, 'todo paso mal');
//             res.send(error)
//         });
// }
// const createSuscription = (req, res) => {
//     console.log('entroooo a suscription');
//     /*  Vendedor
//         id: 1300873485
//         token: TEST-3554298348301023-020200-6b6fde46744d71a639f4e05a107a7fd6-1300873485
//         email: test_user_1300873485@testuser.com
//      */
//     mercadopago.configure({
//         access_token: process.env.TOKEN_VENDOR
//     });

//     const items = {
//       "reason": "Yoga classes",
//       "auto_recurring": {
//         "frequency": 1,
//         "frequency_type": "months",
//         "repetitions": 12,
//         "billing_day": 10,
//         "billing_day_proportional": true,
//         "free_trial": {
//           "frequency": 1,
//           "frequency_type": "months"
//         },
//         "transaction_amount": 10,
//         "currency_id": "ARS"
//       },
//       "items": [
//         {
//           "title": "Plan Mensual Incopy",
//           "unit_price": 1000,
//           "quantity": 1
//         }
//       ],
//       "payment_methods_allowed": {
//         "payment_types": [
//           {}
//         ],
//         "payment_methods": [
//           {}
//         ]
//       },
//       "back_url": "https://www.yoursite.com"
//     }

//     mercadopago.preferences.create(items)
//         .then(response => {
//             console.log('todo paso bien', response.body.id);
//             res.json(response)
//         })
//         .catch(error => {
//             console.error(error, 'todo paso mal');
//             res.send(error)
//         });
// }
const notificationPlan = (req, res) => {
    const data = req;
    console.log(data);
    res.status(200)
}


module.exports = {
}