const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const imoveisController = require("./imoveis/ImoveisController");
const usersController = require("./users/UsersController");

const imoveis = require("./imoveis/Imoveis");
const Category = require("./categories/Category");
const User = require("./users/Users");

// View engine
app.set('view engine', 'ejs');

// Sessions
app.use(session({
    secret: "textoaleatorio",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30000 }
})); 

// Torna o usuário logado disponível nas views EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Static files
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para carregar categorias nas views
app.use((req, res, next) => {
    Category.findAll()
        .then(categories => {
            res.locals.categories = categories;
            next();
        })
        .catch(err => {
            console.error("Erro ao carregar categorias no middleware:", err);
            res.locals.categories = [];
            next();
        });
});

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso');
    })
    .catch(error => {
        console.log(error);
    });

// Controllers
app.use("/", categoriesController);
app.use("/", imoveisController);
app.use("/", usersController);

// Testes de sessão
app.get("/session", (req, res) => {
    req.session.treinamento = "Formação Node.js";
    req.session.ano = 2025;
    req.session.email = "user@user.com";
    req.session.user = {
        username: "user",
        email: "user@user.com",
        id: 10
    };
    res.send("Sessão Gerada");
});

app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    });
});

// Rota para página inicial mostrando lista de imóveis
app.get("/", (req, res) => {
    imoveis.findAll({
        order: [['id', 'DESC']]
    }).then(imoveis => {
        res.render("index", { imoveis });
    });
});

// Rota para listar todos os imóveis (opcional)
app.get("/imoveis", (req, res) => {
    imoveis.findAll({
        order: [['id', 'DESC']]
    }).then(imoveis => {
        res.render("imoveis/index", { imoveis });
    });
});

// Rota para detalhes de um imóvel (pela slug)
app.get("/:slug", (req, res) => {
    const slug = req.params.slug;
    imoveis.findOne({
        where: { slug }
    }).then(imovel => {
        if (imovel) {
            res.render("imoveis/detalhes", { imovel });  // <<< CORRETO
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});



// Rota para listar imóveis por categoria
app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug;
    Category.findOne({
        where: { slug },
        include: [{ model: imoveis }]
    }).then(category => {
        if (category) {
            res.render("index", { imoveis: category.imoveis });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

// Iniciar servidor
app.listen(4000, () => {
    console.log("O servidor está rodando na porta 4000");
});
