define(['app/view/entry', 'app/model/snake'], function(entry, snake) {
    var snake_view = {
        init: function(entry, snake) {
            this.entry = entry;
            this.model = snake;
            this.listeners = [];
            this.choices = [];
            this.num_rounds = 0;
            this.rounds_callback = this.rounds_callback.bind(this);
        },
        // Start the draft, snake style.
        start: function() {
            // Set the background to Rocket Richard
            this.entry.element.style.background = "url('static/images/rocket.jpg') no-repeat center fixed";
            this.entry.element.style.backgroundSize = 'cover';

            // We have to figure out how many rounds there will be in the draft.

            // Create the form for the draft.
            this.div = document.createElement('div');
            this.div.setAttribute('class', 'participant-div');

            this.title = document.createElement('h1');
            this.title.setAttribute('class', 'title');
            this.title.textContent = 'How many rounds will there be?'

            this.input = document.createElement('input');
            this.input.setAttribute('type', 'number');
            this.input.setAttribute('min', '1');
            this.input.setAttribute('value', '10');
            this.input.setAttribute('class', 'big-number-input');

            this.submit = document.createElement('div');
            this.submit.setAttribute('class', 'blue-submit-button');
            this.submit.textContent = 'Submit';
            this.submit.addEventListener('click', this.rounds_callback);

            this.div.appendChild(this.title);
            this.div.appendChild(this.input);
            this.div.appendChild(this.submit);

            // Add the div to the page
            this.entry.element.appendChild(this.div);
            this.input.focus();
        },
        // Gets called when user selects number of rounds.
        rounds_callback: function() {
            this.num_rounds = this.input.value;

            // Clear off the div so we have a clean slate ("THE CLEAN SLATE")
            delete this.title;
            delete this.input;
            delete this.submit;
            while(this.div.firstChild) {
                this.div.removeChild(this.div.firstChild);
            }
        },
        // Add participants to the snake.
        add_participants: function(partis) {
            for(var i = 0; i < partis.length; i++) {
                this.model.add_entry(partis[0]);
            }
        },
        // Register callbacks for the result
        register_callback: function(callback) {
            this.listeners.push(callback);
        },
        // Call the callbacks with the choices.
        call_callbacks: function() {
            for(var i = 0; i < this.listeners.length; i++) {
                this.listeners[i](this.choices);
            }
        }
    };

    snake_view.init(entry, snake);
    return snake_view;

});
