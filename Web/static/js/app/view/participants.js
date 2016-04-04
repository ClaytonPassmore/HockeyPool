define(['app/view/entry'], function(entry) {
    var participants = {
        // Initialize with the entry point
        init: function(entry) {
            this.entry = entry;

            this.listeners = [];
            this.participants = [];
        },
        start: function() {
            // Set the Bobby Orr background.
            // Should probably copy this image at some point.
            this.entry.element.style.background = "url('static/images/bobby.jpg') no-repeat center fixed";
            this.entry.element.style.backgroundSize = 'cover';
            // Create the form for adding people.
            this.div = document.createElement('div');
            this.div.setAttribute('class', 'participant-div');

            // Add the div to the page
            this.entry.element.appendChild(this.div);
            this.how_many();
        },
        // Create a field so we know how many participants to have.
        how_many: function() {
            this.title = document.createElement('h1');
            this.title.setAttribute('class', 'title');
            this.title.textContent = 'How many participants are there?'

            this.input = document.createElement('input');
            this.input.setAttribute('type', 'number');
            this.input.setAttribute('min', '1');
            this.input.setAttribute('value', '10');
            this.input.setAttribute('class', 'big-number-input');

            this.submit = document.createElement('div');
            this.submit.setAttribute('class', 'blue-submit-button');
            this.submit.textContent = 'Submit';
            // Dirty hack.
            this.this_many = this.this_many.bind(this);
            this.submit.addEventListener('click', this.this_many);

            this.div.appendChild(this.title);
            this.div.appendChild(this.input);
            this.div.appendChild(this.submit);
            this.input.focus();
        },
        // Determine the number of participants from the input.
        // Initialize name input.
        this_many: function() {
            this.num_participants = this.input.value;
            this.current_participant = 0;
            this.do_name_entry();
            // Transform input into text input
            delete this.input.min
            this.input.setAttribute('type', 'text');
            this.input.setAttribute('class', 'big-text-input');
            this.input.value = '';
            this.input.focus();
            this.submit.removeEventListener('click', this.this_many);
            this.get_name = this.get_name.bind(this); // Dirty hack.
            this.submit.addEventListener('click', this.get_name);
        },
        // Tear down form and build new one for name entry.
        do_name_entry: function() {
            this.current_participant++;
            this.title.textContent = 'Enter team #' + this.current_participant
            if(this.current_participant != this.num_participants) {
                this.submit.textContent = 'Next';
            } else {
                this.submit.textContent = 'Finish';
            }
        },
        get_name: function() {
            // Reject input less than 1
            if(this.input.value.length < 1) {
                this.current_participant--;
                this.input.focus();
                this.do_name_entry();
                return;
            }
            // Add the participant, clear the field.
            this.participants.push(this.input.value);
            this.input.value = '';

            // Get another participant name
            if(this.current_participant != this.num_participants) {
                this.input.focus();
                this.do_name_entry();
            } else {
                // Remove ourselves from listeners.
                this.submit.removeEventListener('click', this.get_name);
                this.call_callbacks();
            }
        },
        // Register callbacks.
        register_callback: function(callback) {
            this.listeners.push(callback)
        },
        call_callbacks: function() {
            for(var i = 0; i < this.listeners.length; i++) {
                this.listeners[i](this.participants);
            }
        }
    };

    participants.init(entry);
    return participants;
});
