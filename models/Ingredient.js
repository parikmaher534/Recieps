var Ingredient,
    mongoose = require('mongoose');

IngredientSchema = mongoose.Schema({
    name: { type: String, trim: true },
    sinonym: [{ type: String, trim: true }]
});

module.exports = {
    name: 'Ingredient',
    model: mongoose.model('Ingredient', IngredientSchema)
};
