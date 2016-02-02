$(function() {
    var content = $('#content'),
        ingTmpl = Handlebars.compile($('#ingredient-tmpl').html());


    function _buildIngredients(data) {
        data.forEach(function(ingredient) {
            ingredient.sinonym = ingredient.sinonym.join();

            content.append(ingTmpl(ingredient));

            content.find('.ingredient__remove:last')
                   .on('click', _removeIngredient);

            content.find('.ingredient__edit:last')
                   .on('click', _editIngredient);

            content.find('form button:last')
                   .on('click', _saveIngredient);
        });
    };

    function _removeIngredient(e) {
        var el = $(e.target).closest('.ingredient'),
            id = el.data('id');

        if (confirm('ТОЧНО?')) {
            $.ajax({
                url: '/admin/.ingredients',
                data: { id: id },
                type: 'DELETE',
                success: function(data) {
                    if (data.status == 200) {
                        el.remove();
                    };
                }
            });
        };
    };

    function _editIngredient(e) {
        var el = $(e.target).closest('.ingredient'),
            id = el.data('id'),
            form = el.find('form');

        if (!form.is(':visible')) {
            form.show();
        } else {
            form.hide();
        };
    };

    function _saveIngredient(e) {
        e.preventDefault();

        var el = $(e.target).closest('.ingredient'),
            id = el.data('id'),
            form = $(e.target).closest('form'),
            name = form.find('input[name="name"]').val(),
            sinonym = form.find('textarea').val();

        $.ajax({
            url: '/admin/.ingredients',
            data: { id: id, name: name, sinonym: sinonym },
            type: 'PUT',
            success: function(data) {
                if (data.status == 200) {
                    el.find('.ingredient__name').text(name);
                    form.hide();
                };
            }
        });

    };

    $.ajax({
        url: '/admin/.ingredients',
        type: 'GET',
        success: _buildIngredients
    });
});
