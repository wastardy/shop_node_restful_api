const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth.js');

const {
    sign_up, 
    log_in, 
    delete_particular_user
} = require('../controllers/user.js')

router.post('/signup', sign_up);

router.post('/login', log_in);

router.delete('/:user_id', checkAuth,   delete_particular_user);

module.exports = router;