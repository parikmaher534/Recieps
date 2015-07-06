$(function() {
    var _currentRecipe,
        _recipeTmplSrc,
        _recipeTmpl,
        _recipeBlock,
        results = $('.results');


    results.on('click', _showFullDescription);


    function _showFullDescription(e) {
        var id,
            el = $(e.target),
            parent = el.closest('.recipe-full');

        if (parent.length) {
            _currentRecipe = parent.closest('.recipe-item');
            id = _currentRecipe.data('id');

            $.ajax({
                type: 'GET',
                url: '.recipe',
                data: {
                    id: id
                },
                dataType: 'json',
                success: _onGetRecipe,
                error: _onGetRecipeError
                //complete: _unlockButton
            });
        }
    };

    function _onGetRecipe(res) {
        $('.recipe-item-view').remove();

        _currentRecipe.find('.recipe-full').hide();

        _createRecipeView(res);
    };

    function _createRecipeView(res) {
        _recipeTmplSrc = $("#recipe-item-view").html();
        _recipeTemplate = Handlebars.compile(_recipeTmplSrc);

        if (_currentRecipe.index() % 2 == 0) {
            _currentRecipe.next().after(_recipeTemplate(res));
        } else {
            _currentRecipe.after(_recipeTemplate(res));
        }

        _recipeBlock = $('.recipe-item-view');
        _recipeBlockNAME = $('.recipe-item-view-name');
        _recipeBlockDESCRIPTION = $('.recipe-item-view-description');
        _recipeBlockCONTENT = $('.recipe-item-view-content');

        $('.recipe-close').on('click', _onReciewViewHide);
    };

    function _onReciewViewHide(e) {
        _currentRecipe.find('.recipe-full').show();

        _recipeBlock.hide();
    };

    function _onGetRecipeError(error) {
        console.log(error);
    };
});