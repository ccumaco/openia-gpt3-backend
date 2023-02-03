const mercadopago = require('mercadopago');

const back_url = "https://openia-gpt3-backend-production.up.railway.app/"
const createPlan = (req, res) => {
    console.log('entroooo');
    /*  Vendedor
        id: 1300873485
        token: TEST-3554298348301023-020200-6b6fde46744d71a639f4e05a107a7fd6-1300873485
        email: test_user_1300873485@testuser.com
     */
    mercadopago.configure({
        access_token: 'TEST-3554298348301023-020200-6b6fde46744d71a639f4e05a107a7fd6-1300873485'
    });

    const items = {
        "reason": "Yoga classes",
        "items": [
          {
            "title": "Yoga classes",
            "unit_price": 1900,
            "quantity": 1
          }
        ],
        "auto_recurring": {
          "frequency": 1,
          "frequency_type": "months",
          "repetitions": 12,
          "billing_day": 10,
          "billing_day_proportional": true,
          "free_trial": {
            "frequency": 1,
            "frequency_type": "months"
          },
          "transaction_amount": 1900,
          "currency_id": "COP"
        },
        "back_url": {
            success: back_url + 'openia/notification'
        }
      }

    mercadopago.preferences.create(items)
        .then(response => {
            console.log('todo paso bien', response.body.id);
            res.json(response)
        })
        .catch(error => {
            console.error(error, 'todo paso mal');
            res.send(error)
        });
}
const createSuscription = (req, res) => {
    console.log('entroooo');
    /*  Vendedor
        id: 1300873485
        token: TEST-3554298348301023-020200-6b6fde46744d71a639f4e05a107a7fd6-1300873485
        email: test_user_1300873485@testuser.com
     */
    mercadopago.configure({
        access_token: 'TEST-3554298348301023-020200-6b6fde46744d71a639f4e05a107a7fd6-1300873485'
    });

    const items = {
        "items": [
        {
            "title": "Yoga classes",
            "unit_price": 1900,
            "quantity": 1
        }
        ],
        "preapproval_plan_id": "1300873485-7330b922-c5a3-4507-97b7-0bbd0bba3c09",
        "reason": "Yoga classes",
        "external_reference": "YG-1234",
        "payer_email": "test_user_1300901734@testuser.com",
        "card_token_id": "",
        "auto_recurring": {
          "frequency": 1,
          "frequency_type": "months",
          "start_date": "2020-06-02T13:07:14.260Z",
          "end_date": "2022-07-20T15:59:52.581Z",
          "transaction_amount": 10,
          "currency_id": "COP"
        },
        "back_url": back_url + 'openia/notification',
        "status": "authorized"
      }

    mercadopago.preferences.create(items)
        .then(response => {
            console.log('todo paso bien', response.body.id);
            res.json(response)
        })
        .catch(error => {
            console.error(error, 'todo paso mal');
            res.send(error)
        });
}
const notificationPlan = (req, res) => {
    const data = req;
    console.log(data);
    res.status(200)
}


module.exports = {
    createPlan,
    notificationPlan,
    createSuscription
}