var Recipe,
    mongoose = require('mongoose');

RecipeSchema = mongoose.Schema({
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    ingredients: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeIngredient'}
    ],
    time: {type: String },
    photo: { type: String, trim: true },
    content: { type: String, trim: true },
    totalCalories: { type: Number },
    linkToOrigin: { type: String },
    search: [{ type: String, trim: true }]
});

module.exports = {
    name: 'Recipe',
    model: mongoose.model('Recipe', RecipeSchema)
};