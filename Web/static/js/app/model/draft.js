define(['app/model/snake'], function(SnakeModel) {
    var draft =  function(teams, rounds) {
        this.listeners = [];
        this.selections = [];
        this.team_selections = {};
        this.set_teams(teams || undefined);
        this.set_rounds(rounds || undefined);
        this.snake = undefined;

        if(teams && rounds) {
            this.snake = new SnakeModel(teams, rounds);
            this.call_listeners(teams);
        }
        return this;
    };

    draft.prototype.set_teams = function(teams) {
        this.teams = teams;
        this.team_selections = {};
        for(idx in teams) {
            this.team_selections[teams[idx]] = [];
        }
        if(this.rounds && teams) {
            this.snake = new SnakeModel(teams, this.rounds);
        }
        this.call_listeners(teams);
    };

    draft.prototype.set_rounds = function(rounds) {
        this.rounds = rounds;
        if(this.teams && rounds) {
            this.snake = new SnakeModel(this.teams, rounds);
        }
        this.call_listeners(this.teams);
    };

    draft.prototype.add_listener = function(listener) {
        this.listeners.push(listener);
    };

    draft.prototype.call_listeners = function(teams) {
        for(idx in this.listeners) {
            this.listeners[idx](teams);
        }
    };

    draft.prototype.push_selection = function(team, player) {
        this.team_selections[team].push(player);
        this.selections.push([team, player]);
    };

    draft.prototype.pop_selection = function() {
        var popped = this.selections.pop();
        if(!popped) {
            return;
        }
        var team_popped = this.team_selections[popped[0]].pop();
        if(popped[1] != team_popped) {
            console.error('Popped players differ');
            return;
        }
        return team_popped;
    };

    return draft;
});
