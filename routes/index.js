var express = require('express'),
    router = express.Router();


/* Связываем урлы с ручками */
router.get('/', controllers['PageController'].init);
router.get('/.categories', controllers['CategoriesController'].init);


module.exports = router;
