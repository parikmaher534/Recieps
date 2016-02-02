var express = require('express'),
    router = express.Router();


/* Связываем урлы с ручками */
// router.get('/', controllers['PageController'].init);
// router.get('/admin', controllers['AdminController'].init);
// router.get('/admin/.ingredients', controllers['IngredientsController'].get);
// router.get('/admin/.ingredients/remove', controllers['IngredientsController'].delete);

// router.get('/.recipes', controllers['RecipesController'].init);
// router.get('/.recipe', controllers['GetRecipeController'].init);

router.route('/admin/.ingredients')
    .get(controllers['IngredientsController'].get)
    .delete(controllers['IngredientsController'].delete)
    .put(controllers['IngredientsController'].put);

module.exports = router;
