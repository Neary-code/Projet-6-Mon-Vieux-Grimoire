const Books = require('../models/Books');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); // Remplacement de "thing" par "book"
    delete bookObject._id; // Supprime un éventuel _id envoyé dans la requête

    const book = new Books({
        ...bookObject,
        userId: req.auth.userId, // On associe le livre à l'utilisateur authentifié
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null // Ajout de l'image si fournie
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch((error) => {
            console.error('Erreur lors de la création du livre :', error);
            res.status(400).json({ error });
        });
};


exports.modifyBook = (req, res, next) => {
    Books.updateOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch((error) => {
            console.error('Erreur lors de la modification du livre :', error);
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            return Books.deleteOne({ _id: req.params.id });
        })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch((error) => {
            console.error('Erreur lors de la suppression du livre :', error);
            res.status(400).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json(book);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(400).json({ error });
        });
};

exports.getAllBooks = (req, res, next) => {
    Books.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(400).json({ error });
        });
};
