const express = require('express');
const { createPlan, notificationPlan, createSuscription } = require('../controllers/mercadoPago');
const router = express.Router();

router.post('/create-plan', createPlan);
router.post('/notification', notificationPlan);
router.post('/create-suscription', createSuscription);

module.exports = router;