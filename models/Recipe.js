var Recipe,
    mongoose = require('mongoose');

RecipeSchema = mongoose.Schema({
    name: { type: String, trim: true },
    content: { type: String, trim: true },
    ingredients: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients', required: true },
    photo: { type: String, trim: true },
    totalCalories: { type: Number },
    linkToOrigin: { type: String }
});

module.exports = {
    name: 'Recipe',
    model: mongoose.model('Recipe', RecipeSchema)
};