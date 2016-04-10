define(function() {
    var server_addr = 'http://localhost:5000/rest';
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
    return data;
});
