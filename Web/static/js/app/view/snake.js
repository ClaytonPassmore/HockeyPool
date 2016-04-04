define(['app/view/entry', 'app/model/snake'], function(entry, snake) {
    var snake_view = {
        init: function(entry, snake) {
            this.entry = entry;
            this.model = snake;
            this.listeners = [];
            this.choices = [];
        },
        // Start the draft, snake style.
        start: function() {
            this.entry.element.style.background = "url('static/images/rocket.jpg') no-repeat center fixed";
            this.entry.element.style.backgroundSize = 'cover';

            // Create the form for the draft.
            this.div = document.createElement('div');
            this.div.setAttribute('class', 'participant-div');

            // Add the div to the page
            this.entry.element.appendChild(this.div);
            // TODO XXX
        },
        add_participants: function(partis) {
            for(var i = 0; i < partis.length; i++) {
                this.model.add_entry(partis[0]);
            }
        },
        register_callback: function(callback) {
            this.listeners.push(callback);
        },
        call_callbacks: function() {
            for(var i = 0; i < this.listeners.length; i++) {
                this.listeners[i](this.choices);
            }
        }
    };

    snake_view.init(entry, snake);
    return snake_view;

});
