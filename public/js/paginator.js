$(function() {

    var paginatorSource, paginatorTemplate,
    	paginatorItemSource, paginatorItemTemplate;


	$(document).on('build', function(e, data) {
		if (data && data.type === 'paginator') {
			_buildPaginator(data.data);
		}
	});


	function _buildPaginator(data) {
		if (
			!paginatorSource && !paginatorItemSource
		) {
	    	paginatorSource = $("#paginator").html();
	    	paginatorTemplate = Handlebars.compile(paginatorSource);

	    	paginatorItemSource = $("#paginator-item").html();
	        paginatorItemTemplate = Handlebars.compile(paginatorItemSource);
    	};

		_buildAccurated(data);
	};

	function _buildAccurated(data) {
		var htmlStr = '',
			pages = Math.ceil(data.total.acc / data.amount.acc);

		for (var i = 0; i < pages; i++) {
			htmlStr += paginatorItemTemplate({
							num: i, 
							iscurrent: i == 0 ? true : false
						});
		};

        $('.results-accurated').append(paginatorTemplate({ content: htmlStr }));

        _addPaginatorEvents();
	};

	function _addPaginatorEvents() {
		$('.paginator-item__pseudo-link').on('click', function() {
			var pageNum = $(this).data('num');

			// TODO: Сделать метод получения текущего offset и limit рецептов
			// Кешировать результат поиска для пагинатора

			$(document).trigger('get', { type: 'recipes', data: { offset: 0, limit: 0 }});
		});
	};
});
