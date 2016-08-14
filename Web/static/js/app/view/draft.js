define(
['app/view/screen_mgr',
 'app/view/sidebar',
 'app/view/draft_container',
 'app/view/dialogue',
 'app/view/queue',
 'jquery',
 'typeahead'
],
function(ScreenMgr, Sidebar, DraftContainer, Dialogue, Queue, $, typeahead) {
    var draft = function(draft_model, player_bloodhound, team_bloodhound) {
        this.model = draft_model;
        this.player_bloodhound = player_bloodhound;
        this.team_bloodhound = team_bloodhound;
        this.forward_listeners = [];
        this.back_listeners = [];
        this.model.add_listener(this.set_teams.bind(this));
        this.most_recent_selection = null;

        this.screen_mgr = new ScreenMgr();
        this.draft_screen = this.screen_mgr.get_current();
        this.sidebar = new Sidebar();
        this.draft_container = new DraftContainer();
        this.rounds_counter = document.createElement('div');
        this.rounds_counter.setAttribute('class', 'rounds_counter');
        var screen_switcher  = document.createElement('div');
        screen_switcher.setAttribute('class', 'view_selections_button button');
        screen_switcher.innerText = 'View Current Selections';
        screen_switcher.addEventListener('click', function() {
            this.screen_mgr.next();
        }.bind(this));

        this.queue = new Queue();
        this.dialogue = new Dialogue(
            undefined,
            {id: 'typeahead', class: 'dialogue_typeahead_input'},
            this.input_validator.bind(this)
        );
        this.dialogue.add_button_listener(this.submit_handler.bind(this));
        this.dialogue.add_back_listener(this.back_handler.bind(this));

        this.draft_screen.appendChild(this.sidebar.get_element());
        this.draft_screen.appendChild(this.draft_container.get_element());
        this.draft_container.get_element().appendChild(this.queue.get_element());
        this.draft_container.get_element().appendChild(this.dialogue.get_element());
        this.draft_container.get_element().appendChild(this.rounds_counter);
        this.draft_container.get_element().appendChild(screen_switcher);

        $(this.dialogue.input_elem).typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'Players',
            display: 'name',
            source: this.player_bloodhound.get_bloodhound(),
            templates: {
                header: '<h3>Players</h3>',
                suggestion: function(d) {
                    return '<div><strong>' + d.name + '</strong> - ' + d.team + '</div>';
                }
            }
        },
        {
            name: 'Goalies',
            display: 'name',
            source: this.team_bloodhound.get_bloodhound(),
            templates: {
                header: '<h3>Goalies</h3>'
            }
        });


        $(this.dialogue.input_elem).bind(
            'typeahead:select typeahead:autocomplete typeahead:cursorchange',
            function(e, suggestion) {
                this.most_recent_selection = suggestion;
                return suggestion
            }.bind(this)
        );

        this.picks_screen = this.screen_mgr.add_screen();
        var screen_switcher = document.createElement('div');
        screen_switcher.setAttribute('class', 'view_draft_button button');
        screen_switcher.innerText = 'Return to the Draft';
        screen_switcher.addEventListener('click', function() {
            this.screen_mgr.next();
        }.bind(this));
        this.picks_container = document.createElement('div');
        this.picks_container.setAttribute('class', 'picks_container');
        this.picks_container.addEventListener('mousewheel', function(e) {
            this.picks_container.scrollLeft += e.deltaY;
        }.bind(this));

        this.picks_screen.appendChild(screen_switcher);
        this.picks_screen.appendChild(this.picks_container);
        return this;
    };

    draft.prototype.set_teams = function(teams) {
        if(this.team_lists) {
            for(key in this.team_lists) {
                var elem = this.team_lists[key];
                elem.get_element().parentNode.removeChild(elem.get_element());
            }
        }
        this.team_lists = {};
        for(idx in teams) {
            var sidebar = new Sidebar(teams[idx], 'inline_block');
            this.team_lists[teams[idx]] = sidebar;
            this.picks_container.appendChild(sidebar.get_element());
        }

        if(this.model.snake) {
            this.queue.set_items(this.model.snake.get_order());
        }
        this.advance_snake();
    };

    draft.prototype.input_validator = function(input) {
        if(!input) {
            return false;
        }

        if(this.most_recent_selection != null && input == this.most_recent_selection.name) {
            return true;
        }

        var candidate = null;
        var suggestion_filterer = function(suggestions) {
            for(idx in suggestions) {
                if(candidate == null && suggestions[idx].name == input) {
                    candidate = suggestions[idx];
                }
            }
        };

        this.team_bloodhound.get_bloodhound().search(input, suggestion_filterer);
        if(candidate != null) {
            this.most_recent_selection = candidate;
            return true;
        }

        this.player_bloodhound.get_bloodhound().search(input, suggestion_filterer);
        if(candidate != null) {
            this.most_recent_selection = candidate;
            return true;
        }

        this.most_recent_selection = null;
        return false;
    };

    draft.prototype.get_element = function() {
        return this.screen_mgr.get_element();
    };

    draft.prototype.advance_snake = function() {
        if(this.model.snake) {
            if(this.current_picker) {
                this.queue.forward();
            }
            this.current_picker = this.model.snake.next();
            if(!this.current_picker) {
                this.forward_event();
                return;
            }
            this.set_dialogue_title(this.current_picker);
            $(this.dialogue.input_elem).typeahead('val', '');
            this.set_sidebar_title(this.current_picker);
            this.sidebar.set_items(this.model.team_selections[this.current_picker].map(function(item) {
                return item.name;
            }));
            this.set_rounds_counter(this.model.snake.get_current_round(), this.model.snake.get_rounds());
        }
    };

    draft.prototype.go_back_snake = function() {
        if(this.model.snake) {
            this.current_picker = this.model.snake.previous();
            this.queue.back();
            if(!this.current_picker) {
                this.back_event();
                return;
            }
            this.set_dialogue_title(this.current_picker);
            $(this.dialogue.input_elem).typeahead('val', '');
            this.set_sidebar_title(this.current_picker);
            this.sidebar.set_items(this.model.team_selections[this.current_picker].map(function(item) {
                return item.name;
            }));
            this.set_rounds_counter(this.model.snake.get_current_round(), this.model.snake.get_rounds());
        }
    };

    draft.prototype.set_dialogue_title = function(team) {
        var who = team;
        if(who[who.length - 1] == 's') {
            who += "'";
        } else {
            who += "'s";
        }
        this.dialogue.set_title(who + " pick");
    };

    draft.prototype.set_sidebar_title = function(team) {
        var who = team;
        if(who[who.length - 1] == 's') {
            who += "'";
        } else {
            who += "'s";
        }
        this.sidebar.set_title(who + " team");
    };

    draft.prototype.submit_handler = function(player) {
        if(this.most_recent_selection.name != player) {
            // We should NEVER get here.
            console.error('Player name does not match most recently selected');
        }
        this.model.push_selection(this.current_picker, this.most_recent_selection);
        this.team_lists[this.current_picker].set_items(
            this.model.team_selections[this.current_picker].map(function(value) { return value.name; }));

        // TODO: Use a better way to distinguish which bloodhound it came from
        if(this.most_recent_selection.short) {
            this.team_bloodhound.remove(this.most_recent_selection);
        } else {
            this.player_bloodhound.remove(this.most_recent_selection);
        }
        this.most_recent_selection = null;
        this.advance_snake();
    };

    draft.prototype.back_handler = function() {
        var item = this.model.pop_selection();
        if(item) {
            // TODO: Use a better way to distinguish which bloodhound it came from
            if(item.short) {
                this.team_bloodhound.add(item);
            } else {
                this.player_bloodhound.add(item);
            }
        }
        this.go_back_snake();
        if(this.current_picker) {
            this.team_lists[this.current_picker].set_items(
                this.model.team_selections[this.current_picker].map(function(value) { return value.name; }));
        }
    };

    draft.prototype.add_forward_listener = function(listener) {
        this.forward_listeners.push(listener);
    };

    draft.prototype.add_back_listener = function(listener) {
        this.back_listeners.push(listener);
    };

    draft.prototype.forward_event = function() {
        for(idx in this.forward_listeners) {
            this.forward_listeners[idx]();
        }
    };

    draft.prototype.back_event = function() {
        for(idx in this.back_listeners) {
            this.back_listeners[idx]();
        };
    };

    draft.prototype.set_rounds_counter = function(current, total) {
        this.rounds_counter.innerText = 'Round ' + current.toString() + ' of ' + total.toString();
    }

    return draft;
});
