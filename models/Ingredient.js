var Ingredient,
    mongoose = require('mongoose');

IngredientSchema = mongoose.Schema({
    name: { type: String, trim: true },
    calories: { type: Number },
    caloriesType: { type: String, trim: true },
    wikiLink: { type: String }
});

module.exports = {
    name: 'Ingredient',
    model: mongoose.model('Ingredient', IngredientSchema)
};