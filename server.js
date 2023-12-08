const express = require('express');
const cors = require('cors'); 
const verifyToken = require('./middleware/verifyToken');
const authRoutes = require('./routes/authRoutes'); 
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/maBaseDeDonnees', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/testauth', verifyToken, (req, res) => {
    res.send('Hello World!');
});

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
