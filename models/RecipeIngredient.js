var RecipeIngredient,
    mongoose = require('mongoose');

RecipeIngredientSchema = mongoose.Schema({
    amount: { type: String, trim: true },
    ingredient: { type: String, trim: true }
});

module.exports = {
    name: 'RecipeIngredient',
    model: mongoose.model('RecipeIngredient', RecipeIngredientSchema)
};