const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const register = async (req, res) => {

    //Vérifier que les champs ne sont pas vides
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send('Tous les champs doivent être remplis');
    }
  
    // Vérifie que l'utilisateur n'existe pas déjà
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(400).send('Un utilisateur avec cet email existe déjà.');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Créer un nouvel utilisateur
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        score: 0,
        planetHealth: 100,
    });

    // Sauvegarder l'utilisateur dans la base de données
    try {
        const savedUser = await user.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({ token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

const login = async (req, res) => {
    // Vérifier que les champs ne sont pas vides
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Tous les champs doivent être remplis');
    }

    // Chercher l'utilisateur dans la base de données
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("Utilisateur non trouvé");
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send("Identifiants invalides");
        }

        // Créer et envoyer le token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        res.status(500).send("Erreur du serveur");
    }
};

module.exports = { register, login };
