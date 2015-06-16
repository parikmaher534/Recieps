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
        if (!$('.recipe-item-view').length) {
            _createRecipeView(res);
        } else {
            _updateRecipeView(res);
        }
    };

    function _createRecipeView(res) {
        _recipeTmplSrc = $("#recipe-item-view").html();
        _recipeTemplate = Handlebars.compile(_recipeTmplSrc);
        _currentRecipe.after(_recipeTemplate(res));

        _recipeBlock = $('.recipe-item-view');
        _recipeBlockNAME = $('.recipe-item-view-name');
        _recipeBlockDESCRIPTION = $('.recipe-item-view-description');
        _recipeBlockCONTENT = $('.recipe-item-view-content');
    };

    function _updateRecipeView(res) {
        // TODO: this
        if (_currentRecipe.index() % 2 == 0) {
            _currentRecipe.next().after(_recipeBlock);
        } else {
            _currentRecipe.after(_recipeBlock);
        }

        _recipeBlockNAME.text(res.name);
        _recipeBlockDESCRIPTION.text(res.description);
        _recipeBlockCONTENT.html(res.content);
    };

    function _onGetRecipeError(error) {
        console.log(error);
    };
});