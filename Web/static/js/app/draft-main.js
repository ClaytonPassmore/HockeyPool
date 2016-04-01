define(function(require) {
    var $ = require('jquery');
    var typeahead = require('typeahead');
    var Bloodhound = require('bloodhound');

    var entry = document.getElementById('entry');
    var ta = document.createElement('input')
    ta.setAttribute('class', 'typeahead');
    ta.setAttribute('type', 'text');
    entry.appendChild(ta);

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
