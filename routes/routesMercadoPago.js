const express = require('express');
const { saveTransaction, createPlan, createSuscription, notificationPlan } = require('../controllers/mercadoPago');
const router = express.Router();

// router.post('/create-plan', createPlan);
router.get('/notification', notificationPlan);
// router.post('/create-suscription', createSuscription);
// router.post('/save-transaction',  saveTransaction)
module.exports = router;