var express = require('express'),
    router = express.Router();


/* Связываем урлы с ручками */
router.get('/', controllers['PageController'].init);
router.get('/.recipes', controllers['RecipesController'].init);
router.get('/.recipe', controllers['GetRecipeController'].init);


module.exports = router;
