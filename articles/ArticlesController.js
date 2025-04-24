const express = require("express");
const router = express.Router();
const Article = require("./Articles");
const slugify = require("slugify");

// Rota para formulário de novo artigo
router.get("/admin/articles/new", (req, res) => {
    res.render("admin/articles/new"); // Ensure path matches folder structure
});

// Rota para salvar artigo
router.post("/articles/save", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;

    console.log("Título recebido:", title);
    console.log("Conteúdo recebido:", body);

    if (title != undefined && title.trim() !== "" && body != undefined && body.trim() !== "") {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body
        }).then(article => {
            console.log("Artigo salvo:", article);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar artigo:", err);
            res.redirect("/admin/articles/new");
        });
    } else {
        res.redirect("/admin/articles/new");
    }
});

// Rota para listagem de artigos
router.get("/admin/articles", (req, res) => {
    Article.findAll().then(articles => {
        res.render("admin/articles/index", { articles }); // Ensure path matches folder structure
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

// Rota para deletar um artigo
router.post("/articles/delete", (req, res) => {
    const id = req.body.id;

    if (id != undefined && !isNaN(id)) {
        Article.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Artigo deletado, ID:", id);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao deletar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

module.exports = router;
