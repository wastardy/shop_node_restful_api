const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = './uploads/';
const checkAuth = require('../middleware/check_auth.js');

const {
    get_all_products, 
    get_particular_product,
    add_new_product,
    update_particular_product,
    delete_particular_product
} = require('../controllers/products.js')


if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path); 
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = 
            new Date()
            .toISOString()
            .replace(/:/g, '-') 
            + file.originalname;

        callback(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' 
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/png') {
        
        // accept a file
        callback(null, true);
    }
    else {
        // reject a file
        callback(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // only accept 5 mb files
    }, 
    fileFilter: fileFilter
});

// keep in mind that /products already is at the start of URL
router.get('/', get_all_products);

router.get('/:product_id', get_particular_product);

router.post('/', checkAuth, upload.single('product_image'), add_new_product);

router.patch('/:product_id', checkAuth, update_particular_product);

router.delete('/:product_id', checkAuth, delete_particular_product);

module.exports = router;