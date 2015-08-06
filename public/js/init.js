$(function() {
    var _REDRAWTYPE = null,
        _GET_RECIEPS_REQ = null,
        _ISPAGINATED = null,

        OFFSET = 0,
        LIMIT = 10,
        ALIMIT =  LIMIT / 2,
        PAGENUM = 0,
        APPAGENUM = 0,

        body = $('body'),
        search = $('.ingredient-autocomplete'),
        searchButtonWrapper = $('.button__wrapper'),
        searchButton = $('.search-button'),
        results = $('.results');


    _loadTemplates();


    searchButton.on('click', _searchRecipes);

    $(document).on('get', function(e, data) {
        if (data.type == 'recipes') {

            // Номер текущей страницы для точных и приближенных совпадений
            PAGENUM = data.data.page;
            APPAGENUM = data.data.appage;

            _REDRAWTYPE = data.data.redraw;

            _searchRecipes();
        };
    });

    function _searchRecipes() {
        _lockButton();

        if (_GET_RECIEPS_REQ) _GET_RECIEPS_REQ.abort();

        _GET_RECIEPS_REQ = $.ajax({
            type: 'GET',
            url: '.recipes',
            data: _getData(),
            dataType: 'json',
            success: _onGetRecipes,
            error: _onGetRecipesError,
            complete: _unlockButton
        });
    };

    function _getData() {
        var arr = null,
            val = search.val().trim();

        val = val.toLowerCase();

        arr = val.split(',').map(function(ingredient) {
            return capitalize(ingredient.trim());
        });

        return {
            // Точные рецепты
            accOffset: PAGENUM * LIMIT,
            accLimit: LIMIT,

            // Приближенные рецепты
            appOffset: APPAGENUM * ALIMIT,
            appLimit: ALIMIT,

            ingredients: arr.join(',')
        };
    };

    function _onGetRecipes(res) {
        OFFSET += LIMIT;

        _searched();
        
        _drawRecipes(res);

        if (!_ISPAGINATED) {
            _ISPAGINATED = $(document).trigger('build', { type: 'paginator', data: res });
        };

        _GET_RECIEPS_REQ = null;
    };

    function _drawRecipes(res) {
        switch(_REDRAWTYPE) {
            case 'acc':
                _clearResults($('.results-accurated'));
                _buildAccuratedRecipes(res.accurated);
                break;
            case 'app':
                _clearResults($('.results-approximate'));
                _buildApproximateRecipes(res.approximate);
                break;
            default:
                _clearResults($('.results'));
                _buildAccuratedRecipes(res.accurated);
                _buildApproximateRecipes(res.approximate);
        };
    };

    function _searched() {
        body.addClass('searched');
    };

    function _unsearched() {
        body.removeClass('searched');
    };

    function _clearResults(parent) {
        parent.find('.recipe-item').remove();
    };

    function _lockButton() {
        searchButtonWrapper.addClass('buttons__disabled');
    };

    function _unlockButton() {
        searchButtonWrapper.removeClass('buttons__disabled');
    };

    function _buildAccuratedRecipes(recipes) {
        var maxLn = 100,
            source = $("#recipe-item").html(),
            template = Handlebars.compile(source);

        recipes.forEach(function(recipe) {
            var text = $(recipe.all.content).text();

            if (text.length > maxLn) text = text.substr(0, maxLn) + '...';

            recipe.text = text;
            recipe.accurated = true;

            $('.results-accurated').append(template(recipe));
        });
    };

    function _buildApproximateRecipes(recipes) {
        var maxLn = 100,
            source = $("#recipe-item").html(),
            template = Handlebars.compile(source);

        recipes.forEach(function(recipe) {
            var text = $(recipe.all.content).text();

            if (text.length > maxLn) text = text.substr(0, maxLn) + '...';

            recipe.text = text;
            recipe.approximate = true;

            $('.results-approximate').append(template(recipe));
        });
    };

    function _onGetRecipesError(error) {
        console.error(error);
    };

    function _loadTemplates() {
        $(function(){
            $(".templates").load("/view/blocks.html");
        });
    };
});
