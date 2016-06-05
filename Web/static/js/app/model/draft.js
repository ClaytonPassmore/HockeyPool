define(['app/model/snake'], function(SnakeModel) {
    var draft =  function(teams, rounds) {
        this.listeners = [];
        this.set_teams(teams || undefined);
        this.set_rounds(rounds || undefined);
        this.snake = undefined;

        if(teams && rounds) {
            this.snake = new SnakeModel(teams, rounds);
            this.call_listeners();
        }
        return this;
    };

    draft.prototype.set_teams = function(teams) {
        this.teams = teams;
        if(this.rounds && teams) {
            this.snake = new SnakeModel(teams, this.rounds);
        }
        this.call_listeners();
    };

    draft.prototype.set_rounds = function(rounds) {
        this.rounds = rounds;
        if(this.teams && rounds) {
            this.snake = new SnakeModel(this.teams, rounds);
        }
        this.call_listeners();
    };

    draft.prototype.add_listener = function(listener) {
        this.listeners.push(listener);
    };

    draft.prototype.call_listeners = function() {
        for(idx in this.listeners) {
            this.listeners[idx]();
        }
    };

    return draft;

    /*var server_addr = 'http://localhost:5000/rest';
    var data = {
        init: function() {
            this.teams = {};
            this.players = {};
            this.listeners = [];
            this.rest_callback = this.rest_callback.bind(this);
        },
        // Async request to server for data
        get_data: function() {
            var xml = new XMLHttpRequest();
            xml.addEventListener('load', this.rest_callback);
            xml.open('get', server_addr, true);
            xml.send();
        },
        // Callback once data has been loaded
        rest_callback: function(e) {
            if(e.target.readyState == 4 && e.target.status == 200) {
                var response = JSON.parse(e.target.responseText);
                this.teams = response.teams;
                this.players = response.players;
                // Alert listeners that data is ready.
                for(var i = 0; i < this.listeners.length; i++) {
                    this.listeners[i](this.teams, this.players);
                }
            } else {
                console.error('Failed to load player data');
            }
        },
        // Add listener for when the data is loaded
        add_listener: function(func) {
            this.listeners.push(func);
        }
    };

    data.init();
    return data;*/
});
