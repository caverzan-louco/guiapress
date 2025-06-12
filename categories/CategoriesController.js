const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

// Rota para formulário de nova categoria
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
});

// Rota para salvar categoria
router.post("/categories/save", (req, res) => {
    console.log("req.body:", req.body); // 👈 Debug
    const title = req.body.title;
    console.log("Título recebido:", title);

    if (title && title.trim() !== "") {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(category => {
            console.log("Categoria salva:", category);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao salvar categoria:", err);
            res.redirect("/admin/categories/new");
        });
    } else {
        res.redirect("/admin/categories/new");
    }
});

// Rota para listagem de categorias
router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        console.log("Categorias encontradas:", categories);
        res.render("admin/categories/index", { categories });
    }).catch(err => {
        console.error("Erro ao buscar categorias:", err);
        res.redirect("/");
    });
});

// Rota para deletar uma categoria
router.post("/categories/delete", (req, res) => {
    const id = req.body.id;

    if (id && !isNaN(id)) {
        Category.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Categoria deletada, ID:", id);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao deletar categoria:", err);
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories");
    }
});

// Rota para carregar dados para edição
router.get("/admin/categories/edit/:id", (req, res) => {
    const id = req.params.id;

    Category.findByPk(id).then(category => {
        if (category) {
            res.render("admin/categories/edit", { category: category });
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(err => {
        console.error("Erro ao buscar categoria para edição:", err);
        res.redirect("/admin/categories");
    });
});

// Rota para salvar edição
router.post("/categories/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    Category.update({
        title: title,
        slug: slugify(title)
    }, {
        where: { id: id }
    }).then(() => {
        console.log("Categoria atualizada, ID:", id);
        res.redirect("/admin/categories");
    }).catch(err => {
        console.error("Erro ao atualizar categoria:", err);
        res.redirect("/admin/categories");
    });
});

module.exports = router;
