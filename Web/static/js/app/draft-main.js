define(['app/view/screen_mgr', 'app/view/sidebar', 'app/view/draft_container', 'app/view/title_span', 'app/view/dialogue'],
    function(ScreenMgr, SideBar, DraftContainer, TitleSpan, Dialogue) {

    var screen_mgr = new ScreenMgr();
    var title_screen = screen_mgr.get_current();
    var teams_screen = screen_mgr.add_screen();
    var draft_screen = screen_mgr.add_screen();

    var event_queue = [];
    var back_handler = function() {
        if(event_queue.length > 0) {
            event_queue.pop();
        }
        screen_mgr.previous();
    };
    var button_handler = function(event) {
        event_queue.push(event);
        screen_mgr.next();
    };

    title_span = new TitleSpan('Welcome to the Draft');
    title_screen.appendChild(title_span.get_element());
    title_screen.addEventListener('click', screen_mgr.next.bind(screen_mgr));

    var input_props = {'type': 'number', 'min': '1', 'value': '10'};
    var num_teams_dialogue = new Dialogue('How many teams are there?', input_props);
    num_teams_dialogue.add_back_listener(back_handler);
    num_teams_dialogue.add_button_listener(button_handler);
    teams_screen.appendChild(num_teams_dialogue.get_element());

    sidebar = new SideBar();
    sidebar.hide();
    sidebar.set_title("Clayton's Picks");
    sidebar.set_items(['Sydney Crosby', 'Snoop Dogg', 'Kobe Bryant', 'Lebron James']);

    draft_container = new DraftContainer();
    draft_screen.appendChild(sidebar.get_element());
    draft_screen.appendChild(draft_container.get_element());
});
