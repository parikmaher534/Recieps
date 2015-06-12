$(function() {
    var search = $('.ingredient-autocomplete');

    loadTemplates();


    $('.search-button').on('click', _searchRecipes);


    function _searchRecipes() {
        $.ajax({
            type: 'GET',
            url: '.recipes',
            data: getData(),
            dataType: 'json',
            success: _onGetRecipes,
            error: _onGetRecipesError
        });
    };

    function getData() {
        var arr = null,
            val = search.val().trim();

        val = val.toLowerCase();

        arr = val.split(',').map(function(ingredient) {
            return capitalize(ingredient.trim());
        });

        return {
            ingredients: arr.join(',')
        };
    };

    function _onGetRecipes(res) {
        _buildAccuratedRecipes(res.accurated);
    };

    function _buildAccuratedRecipes(recipes) {
        var source = $("#recipe-item").html(),
            template = Handlebars.compile(source);

        recipes.forEach(function(recipe) {
            var text = $(recipe.all.content).text();

            if (text.length > 100) text = text.substr(0, 200) + '...';

            recipe.text = text;

            $('.results').append(template(recipe));
        });
    };

    function _onGetRecipesError() { /* TODO */ };

    function loadTemplates() {
        $(function(){
            $(".templates").load("/view/blocks.html");
        });
    };
});
