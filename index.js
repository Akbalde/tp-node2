const express = require('express');
const session = require('express-session');                 
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');   
const app = express();
const port = 3000;

// Utilisation de EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Middleware pour parser le corps des requêtes
app.use(bodyParser.urlencoded({ extended: true }));

// Page d'accueil
app.get('/', (req, res) => {
  res.render('login');
});

// Gestion du formulaire de login
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Vérification basique - Vous devriez utiliser une base de données pour une authentification sécurisée
  if (username === 'utilisateur' && password === '12345') {
    
      res.render('form');
    
    
  } else {
    res.send('Identifiants incorrects. Veuillez réessayer.');
  }
});




// Configuration de Multer pour la gestion des fichiers uploadés
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Configuration de la session
app.use(session({
  secret: 'votreSecret',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static('public')); // Dossier contenant les fichiers statiques



app.get('/form', (req, res) => {
  res.render('form');
});

app.post('/submit', upload.single('image'), (req, res) => {
  const { nom, prenom } = req.body;
  const image = req.file ? req.file.filename : 'default.jpg';

  // Stockage des données dans la session
  req.session.formData = { nom, prenom, image };

  // Ici, vous pouvez effectuer le traitement des données reçues

  res.render('liste', { formData: req.session.formData });
});

app.get('/liste', (req, res) => {
    // Récupération des données depuis la session
 const formData = req.session.formData || null;
  res.render('liste', { formData });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
