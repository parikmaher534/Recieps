({
    block : 'page',

    title : 'Title of the page',

    favicon : '/favicon.ico',

    head : [
        { elem : 'meta', attrs : { name : 'description', content : '' } },
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } },
        { elem : 'css', url : 'frontend/desktop.bundles/index/index.css' }
    ],

    scripts: [
        { elem : 'js', url : 'frontend/desktop.bundles/index/index.bemhtml.js' },
        { elem : 'js', url : 'frontend/desktop.bundles/index/_index.js' }
    ],

    mods : { theme : 'islands' },

    content : { block: 'b-content' }
});