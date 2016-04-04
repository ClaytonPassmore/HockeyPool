define(function(require) {
    var $ = require('jquery');
    var typeahead = require('typeahead');
    var Bloodhound = require('bloodhound');

    // Snake to keep track of whose turn it is.
    var snake = require('app/view/snake');

    // Get a handle on the entry point.
    var entry = require('app/view/entry');
    var participants = require('app/view/participants');

    // This will get called when we know the participants.
    var parti_callback = function(parties) {
        console.log(parties);
        entry.clear();
    }

    participants.register_callback(parti_callback);
    // XXX participants.start();
    snake.add_participants(['one', 'two', 'three']);
    snake.start();

    // Add a typeahead box
    /*var ta = document.createElement('input')
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
    });*/
});
