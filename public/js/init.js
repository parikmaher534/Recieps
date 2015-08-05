$(function() {
    var OFFSET = 0,
        LIMIT = 10,
        body = $('body'),
        search = $('.ingredient-autocomplete'),
        searchButtonWrapper = $('.button__wrapper'),
        searchButton = $('.search-button'),
        results = $('.results');


    _loadTemplates();


    searchButton.on('click', _searchRecipes);


    function _searchRecipes() {
        _lockButton();

        $.ajax({
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
            offset: OFFSET,
            limit: LIMIT,
            ingredients: arr.join(',')
        };
    };

    function _onGetRecipes(res) {
        OFFSET += LIMIT;

        _searched();
        _clearResults();
        
        _buildAccuratedRecipes(res.accurated);
        _buildApproximateRecipes(res.approximate);

        $(document).trigger('build', { type: 'paginator', data: res.paginator });
    };

    function _searched() {
        body.addClass('searched');
    };

    function _unsearched() {
        body.removeClass('searched');
    };

    function _clearResults() {
        $('.results-approximate, .results-accurated').empty();
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
