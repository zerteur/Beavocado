// Déclaration des modules

const express = require('express'),
path = require('path'),
favicon = require('serve-favicon'),
nunjucks = require('nunjucks'),
mongoose = require('mongoose');

// Creation d'une application web

app = express();

// Parametre du serveur
	
	// Sécurisation de l'url et selection d'un format pour le transfer d'info en parsing

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine('html', nunjucks.render);

	// Déclaration de l'ip et du port

port = 8080; 
ip = "localhost";

app.listen(port, () => {
  console.log(`ExpressJS app listening at http://${ip}:${port}`)
})

	// Utilisation d'un favicon

app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Configure le dossier ou nos vues seront stocker et l'extension par default

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'html');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Connection a la base de donnée

mongoose.connect('mongodb+srv://admin:bellerousse@testingdb.eygxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
	
var articleSchema = new mongoose.Schema({
	title: String,
	content: String,
	updated: Date,
	image: String
});

	// Creation d'un modele Article sur la BDD
var Article = mongoose.model('Article', articleSchema);

// Génération des pages html

	// Creation de l'index

app.get('/', function(req, res){
Article.find({}).sort({updated: -1}).exec(function(err, articles){
	if(err){throw err;}
	data = {title: "ExpressJS", articles: articles};
    res.render('index', data);

	});
});
	
	// Creation de la page pour creer les articles

app.get('/create', function(req, res){
	var data = {title: 'Ajouter'}
	res.render('create', data);
});

	// Creation de la page pour acceder aux articles

app.get('/article/:id', function(req, res){
	var article = Article.findById(req.params.id, function(err, article){
		if(err){throw err}
			var data = {article: article, title: article.title};
		res.render('article', data)
	});
});

	// Creation de la page pour supprimer les articles

app.get('/destroy/:id', function(req, res){
	Article.deleteOne({ _id : req.params.id}, function(err){
		res.render('destroyed');
	});
});

	// Creation de la page pour modifier les articles

app.get('/edit/:id', function(req, res){
	var article = Article.findById(req.params.id, function(err, article){
		if(err){throw err}
			var data = {article: article, title: 'Modifier'+article.title};
		res.render('edit', data)
	});
});

	// Partie pour sauvegarder l'article

app.post('/store', function(req, res){
	var article = new Article({
		title: req.body.titre,
		content: req.body.contenu,
		image: req.body.miniature,
		updated: new Date()

	});

	// Partie pour sauvegarder les changements d'articles

app.post('/update/:id', function(req, res){
	Article.updateOne({ _id : req.params.id}, {
		title: req.body.titre, content: req.body.contenu, updated: new Date(), image: req.body.miniature
	},
	function(err){
		if(err){throw err;}
		res.render('created');
	});
});

	// article sauvegarder qui affiche un message comme quoi ca a marcher

	article.save(function(err, article){
		if(err){throw err;}
		res.render('created');
	});
});