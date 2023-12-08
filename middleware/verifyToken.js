const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const tokenHeader = req.header('Authorization');
  
    if (!tokenHeader) return res.status(401).send('Accès refusé: Pas de token fourni');
  
    const token = tokenHeader.replace('Bearer ', '');
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send('Token invalide');
    }
  };
  

module.exports = verifyToken;
