$(function() {

    var CURRENT_PAGE = 0,
    	paginatorSource, paginatorTemplate,
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
			pages = Math.ceil(data.paginator.total.acc / data.limit);

		for (var i = 0; i < pages; i++) {
			htmlStr += paginatorItemTemplate({
							pageNum: i + 1,
							num: i, 
							iscurrent: i == CURRENT_PAGE ? true : false
						});
		};

        $('.results-accurated').prepend(paginatorTemplate({ content: htmlStr }));

        _addPaginatorEvents();
	};

	function _addPaginatorEvents() {
		$('.paginator-item__pseudo-link').on('click', function() {
			var pageNum = $(this).data('num'),
				isCurrent = $(this).parent().hasClass('paginator-current');

			if (!isCurrent) {
				$('.paginator-tem').removeClass('paginator-current');
				$(this).parent().addClass('paginator-current');

				CURRENT_PAGE = pageNum;

				$(document).trigger('get', { 
					type: 'recipes', 
					data: { 
						redraw: 'acc',
						page: pageNum, 
						appage: 0 //TODO: это
					}
				});
			};
		});
	};
});
