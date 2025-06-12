const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const imoveis = connection.define("imoveis", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageUrl: {                    
        type: Sequelize.STRING,
        allowNull: true
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Category.hasMany(imoveis);       
imoveis.belongsTo(Category);     

imoveis.sync({ force: false });

module.exports = imoveis;
