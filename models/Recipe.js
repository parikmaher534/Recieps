var Recipe,
    mongoose = require('mongoose');

RecipeSchema = mongoose.Schema({
    name: { type: String, trim: true, index: 1 },
    description: { type: String, trim: true },
    ingredients: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeIngredient' }
    ],
    time: {type: String },
    photo: { type: String, trim: true },
    content: { type: String, trim: true },
    totalCalories: { type: Number },
    linkToOrigin: { type: String },
    search: [{ type: String, trim: true, index: true }]
});

RecipeSchema.index({ search: 1 });

module.exports = {
    name: 'Recipe',
    model: mongoose.model('Recipe', RecipeSchema)
};