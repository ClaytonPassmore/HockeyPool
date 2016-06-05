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
        this.model.add_listener(this.on_data_change.bind(this));

        this.screen_mgr = new ScreenMgr();
        this.draft_screen = this.screen_mgr.get_current();
        this.sidebar = new Sidebar();
        this.draft_container = new DraftContainer();
        this.dialogue = new Dialogue();
        this.draft_screen.appendChild(this.sidebar.get_element());
        this.draft_screen.appendChild(this.draft_container.get_element());
        this.draft_container.get_element().appendChild(this.dialogue.get_element());

        this.picks_screen = this.screen_mgr.add_screen();
        return this;
    }

    draft.prototype.get_element = function() {
        return this.screen_mgr.get_element();
    };

    draft.prototype.on_data_change = function() {
        if(this.model.snake) {
            this.current_picker = this.model.snake.next();
            this.set_dialogue_title(this.current_picker);
            this.set_sidebar_title(this.current_picker);
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

    return draft;
});
