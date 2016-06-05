define(['app/view/screen_mgr', 'app/view/sidebar', 'app/view/draft_container', 'app/view/dialogue'],
    function(ScreenMgr, Sidebar, DraftContainer, Dialogue) {

    // TODO:
    // Bloodhound / TypeAhead module
    // Queue
    // Sidebar
    // Screen ^
    // Screen for other teams' picks
    // Buttons to switch between screens

    var draft = function() {
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

    return draft;
});
