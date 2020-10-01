const express = require('express');
const RouteHelper = require('../../lib/RouteHelper');

const router = express.Router();

router.post('/create', async function (
  req,
  res,
  next
) {

  return RouteHelper.perform(req, res, '/order/Create');
});

router.post('/return', async function (
  req,
  res,
  next
) {

  return RouteHelper.perform(req, res, '/order/Return');

});


module.exports = router;