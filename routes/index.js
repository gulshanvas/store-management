const express = require('express');
const orderRoute = require('./order/index');
const productRoute = require('./product/index');

const AuthWrapper = require('../wrapper/Auth');

const router = express.Router();


router.use(AuthWrapper.getUser);

router.use('/product', productRoute);
router.use('/order', orderRoute);

module.exports = router;