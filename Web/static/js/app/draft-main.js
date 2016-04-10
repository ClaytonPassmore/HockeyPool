define(function(require) {
    // Snake to keep track of whose turn it is.
    var snake = require('app/view/snake');

    // Get a handle on the entry point.
    var entry = require('app/view/entry');
    var participants = require('app/view/participants');

    // This will get called when we know the participants.
    var parti_callback = function(parties) {
        snake.add_participants(parties);
        entry.clear();
        snake.start();
    }

    // Start the process by getting the participants ready
    participants.register_callback(parti_callback);
    participants.start();
});
