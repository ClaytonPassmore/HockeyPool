requirejs.config({
    baseUrl: 'static/js/lib',
    paths: {
        'app': '../app',
        'typeahead': 'typeahead.jquery'
    },
    shim: {
        typeahead: {
            deps: ['jquery'],
            init: function($) {
                return require.s.contexts._.registry['typeahead.js'].factory($);
            }
        },
        bloodhound: {
            deps: ['jquery'],
            exports: 'Bloodhound'
        }
    }
});
