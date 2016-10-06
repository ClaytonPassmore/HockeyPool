define(function() {
    var fetch_players = function(url) {
        this.url = url;
        this.response = null;
        this.listeners = [];
        this.callback = this.callback.bind(this);
        return this;
    };

    fetch_players.prototype.fetch = function() {
        var xml = new XMLHttpRequest();
        xml.addEventListener('load', this.callback);
        xml.open('get', this.url, true);
        xml.send();
    };

    fetch_players.prototype.callback = function(e) {
        if(e.target.readyState == 4 && e.target.status == 200) {
            this.response = JSON.parse(e.target.responseText);
            this.load_event(this.response);
        } else {
            console.error('Failed to load player data');
            alert('Unable to load NHL data. Please reload the page to try again.');
        }
    };

    fetch_players.prototype.add_listener = function(func) {
        this.listeners.push(func);
    };

    fetch_players.prototype.load_event = function(response) {
        for(var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](response.players, response.teams);
        }
    };

    return fetch_players;
});
