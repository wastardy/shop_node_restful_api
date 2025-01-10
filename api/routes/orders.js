const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth.js');

const {
    get_all_orders,
    get_particular_order,
    create_new_order,
    delete_particular_order
} = require('../controllers/orders.js');

router.get('/', checkAuth, get_all_orders);

router.get('/:order_id', checkAuth, get_particular_order);

router.post('/', checkAuth, create_new_order);

router.delete('/:order_id', checkAuth, delete_particular_order);

module.exports = router;