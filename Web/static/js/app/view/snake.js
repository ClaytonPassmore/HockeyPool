define(['app/view/entry', 'app/model/snake', 'app/model/draft_data', 'jquery', 'typeahead', 'bloodhound'],
function(entry, snake, data, $, typeahead, Bloodhound) {
    var snake_view = {
        init: function(entry, snake, data) {
            this.entry = entry;
            this.model = snake;
            this.data = data;
            this.listeners = [];
            this.choices = [];
            this.num_rounds = 0;

            // Variables for typeahead
            this.teams = false;
            this.players = false;
            this.team_bloodhound = false;
            this.player_bloodhound = false;

            this.rounds_callback = this.rounds_callback.bind(this);
            this.data_callback = this.data_callback.bind(this);

            // Add listener for the hockey data
            this.data.add_listener(this.data_callback);
            this.data.get_data();
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
            // TODO make this a little more robust...
            if(this.team_bloodhound == false || this.player_bloodhound == false) {
                console.error('Could not load player data');
                var err = document.createElement('h1');
                err.textContent = 'ERROR: Could not load player or team data.'
                this.div.appendChild(err);
                return;
            }
            this.begin_snake();
        },
        // Get team and player data
        data_callback: function(teams, players) {
            this.teams = teams;
            this.players = players;
            this.team_bloodhound = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: this.teams
            });
            this.player_bloodhound = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: this.players
            });
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
        },
        begin_snake: function() {
            this.title = document.createElement('h1');

            this.input = document.createElement('input');
            this.input.setAttribute('id', 'typeahead');
            this.input.setAttribute('class', 'text-input');
            this.input.setAttribute('type', 'text');

            this.submit = document.createElement('div');
            this.submit.setAttribute('class', 'blue-submit-button');
            this.submit.textContent = 'Next';

            this.div.appendChild(this.title);
            this.div.appendChild(this.input);
            this.div.appendChild(this.submit);

            // Set up typeahead
            $('#typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'Players',
                display: 'name',
                source: this.player_bloodhound,
                templates: {
                    header: '<h3>Players</h3>',
                    suggestion: function(d) { return '<div><strong>' + d.name + '</strong> - ' + d.team + '</div>'; }
                }
            },
            {
                name: 'Goalies',
                display: 'name',
                source: this.team_bloodhound,
                templates: {
                    header: '<h3>Goalies</h3>'
                }
            });
        }
    };

    snake_view.init(entry, snake, data);
    return snake_view;

});
