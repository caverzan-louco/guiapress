const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const imoveis = require("./Imoveis");
const slugify = require("slugify");

// Listar todos os imóveis
router.get("/admin/imoveis", async (req, res) => {
    try {
        const lista = await imoveis.findAll({
            include: [{ model: Category }]
        });

        res.render("admin/imoveis/index", { imoveis: lista });
    } catch (err) {
        console.error("❌ Erro ao buscar imóveis em /admin/imoveis:");
        console.error(err); // <-- Aqui você verá o erro real
        res.status(500).send("Erro interno ao buscar imóveis.");
    }
});

// Formulário para criar novo imóvel
router.get("/admin/imoveis/new", async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("admin/imoveis/new", { categories });
    } catch (err) {
        console.error("❌ Erro ao carregar categorias para novo imóvel:");
        console.error(err);
        res.redirect("/admin/imoveis");
    }
});

// Salvar imóvel no banco
router.post("/imoveis/save", async (req, res) => {
    const { title, body, category, imageUrl } = req.body;

    if (title && body && category) {
        try {
            await imoveis.create({
                title,
                slug: slugify(title),
                body,
                categoryId: category,
                imageUrl,
                categoryId: category
            });
            res.redirect("/admin/imoveis");
        } catch (err) {
            console.error("❌ Erro ao salvar imóvel:");
            console.error(err);
            res.redirect("/admin/imoveis/new");
        }
    } else {
        res.redirect("/admin/imoveis/new");
    }
});

// Deletar imóvel
router.post("/imoveis/delete", async (req, res) => {
    const id = req.body.id;

    if (id && !isNaN(id)) {
        try {
            await imoveis.destroy({ where: { id } });
            res.redirect("/admin/imoveis");
        } catch (err) {
            console.error("❌ Erro ao deletar imóvel:");
            console.error(err);
            res.redirect("/admin/imoveis");
        }
    } else {
        res.redirect("/admin/imoveis");
    }
});

// Formulário de edição
router.get("/admin/imoveis/edit/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const imovel = await imoveis.findByPk(id);
        if (imovel) {
            const categories = await Category.findAll();
            res.render("admin/imoveis/edit", { imoveis: imovel, categories });
        } else {
            res.redirect("/admin/imoveis");
        }
    } catch (err) {
        console.error("❌ Erro ao buscar imóvel para edição:");
        console.error(err);
        res.redirect("/admin/imoveis");
    }
});

// Salvar edição
router.post("/imoveis/update", async (req, res) => {
    const { id, title, body,imageUrl, category } = req.body;

    try {
        await imoveis.update({
            title,
            slug: slugify(title),
            body,
            imageUrl,
            categoryId: category
        }, {
            where: { id }
        });
        res.redirect("/admin/imoveis");
    } catch (err) {
        console.error("❌ Erro ao atualizar imóvel:");
        console.error(err);
        res.redirect("/admin/imoveis");
    }
});

module.exports = router;
