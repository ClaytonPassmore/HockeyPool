define(function(require) {
    var $ = require('jquery');
    var typeahead = require('typeahead');
    var Bloodhound = require('bloodhound');

    // Snake to keep track of whose turn it is.
    var snake = require('app/model/snake');

    // Get a handle on the entry point.
    var entry = require('app/view/entry');

    // Add a typeahead box
    var ta = document.createElement('input')
    ta.setAttribute('class', 'typeahead');
    ta.setAttribute('type', 'text');
    entry.element.appendChild(ta);

    var items = ['one', 'two', 'three'];
    var eng = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: items
    });

    $('#entry .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'numbers',
        source: eng
    });
});
