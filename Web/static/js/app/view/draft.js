define(['app/view/screen_mgr', 'app/view/sidebar', 'app/view/draft_container', 'app/view/dialogue'],
    function(ScreenMgr, Sidebar, DraftContainer, Dialogue) {

    // TODO:
    // Bloodhound / TypeAhead module
    // Queue
    // Sidebar
    // Screen ^
    // Screen for other teams' picks
    // Buttons to switch between screens

    var draft = function(draft_model) {
        this.model = draft_model;
        this.forward_listeners = [];
        this.back_listeners = [];
        this.model.add_listener(this.advance_snake.bind(this));

        this.screen_mgr = new ScreenMgr();
        this.draft_screen = this.screen_mgr.get_current();
        this.sidebar = new Sidebar();
        this.draft_container = new DraftContainer();

        this.dialogue = new Dialogue();
        this.dialogue.add_button_listener(this.submit_handler.bind(this));
        this.dialogue.add_back_listener(this.back_handler.bind(this));

        this.draft_screen.appendChild(this.sidebar.get_element());
        this.draft_screen.appendChild(this.draft_container.get_element());
        this.draft_container.get_element().appendChild(this.dialogue.get_element());

        this.picks_screen = this.screen_mgr.add_screen();
        return this;
    }

    draft.prototype.get_element = function() {
        return this.screen_mgr.get_element();
    };

    draft.prototype.advance_snake = function() {
        if(this.model.snake) {
            this.current_picker = this.model.snake.next();
            if(!this.current_picker) {
                this.forward_event();
                return;
            }
            this.set_dialogue_title(this.current_picker);
            this.dialogue.set_input('');
            this.set_sidebar_title(this.current_picker);
            this.sidebar.set_items(this.model.team_selections[this.current_picker]);
        }
    };

    draft.prototype.go_back_snake = function() {
        if(this.model.snake) {
            this.current_picker = this.model.snake.previous();
            if(!this.current_picker) {
                this.back_event();
                return;
            }
            this.set_dialogue_title(this.current_picker);
            this.dialogue.set_input('');
            this.set_sidebar_title(this.current_picker);
            this.sidebar.set_items(this.model.team_selections[this.current_picker]);
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
        this.model.push_selection(this.current_picker, player);
        this.advance_snake();
    };

    draft.prototype.back_handler = function() {
        this.model.pop_selection();
        this.go_back_snake();
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

    return draft;
});
