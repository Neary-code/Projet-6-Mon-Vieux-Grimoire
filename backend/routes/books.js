const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Middleware pour valider l'ID
const validateId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    next();
};

// Routes
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, booksCtrl.createBook);
router.get('/bestrating', booksCtrl.bestRating);
router.get('/:id', validateId, booksCtrl.getOneBook);
router.put('/:id', auth, multer, validateId, booksCtrl.modifyBook);
router.delete('/:id', auth, validateId, booksCtrl.deleteBook);
router.post('/:id/rating', auth, validateId, booksCtrl.rateBook);

module.exports = router;





