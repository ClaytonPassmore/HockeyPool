define(['app/view/entry', 'app/view/screen_mgr', 'app/view/title_span', 'app/view/dialogue', 'app/view/participants'],
    function(Entry, ScreenMgr, TitleSpan, Dialogue, Participants) {

    var entry = new Entry();
    var screen_mgr = new ScreenMgr();
    entry.get_element().appendChild(screen_mgr.get_element());

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

    var title_screen = screen_mgr.get_current();
    var teams_screen = screen_mgr.add_screen();
    var participants_screen = screen_mgr.add_screen();
    var rounds_screen = screen_mgr.add_screen();

    title_span = new TitleSpan('Welcome to the Draft');
    title_screen.appendChild(title_span.get_element());
    title_screen.addEventListener('click', screen_mgr.next.bind(screen_mgr));

    var input_props = {'type': 'number', 'min': '1', 'value': '10'};
    var num_teams_dialogue = new Dialogue('How many teams are there?', input_props);
    num_teams_dialogue.add_back_listener(back_handler);
    num_teams_dialogue.add_button_listener(button_handler);
    teams_screen.appendChild(num_teams_dialogue.get_element());

    // TODO Really need a better name for this
    var participants = new Participants();
    participants_screen.appendChild(participants.get_element());
    participants.add_submit_listener(button_handler);
    participants.add_back_listener(back_handler);
    num_teams_dialogue.add_button_listener(participants.set_num_teams.bind(participants));

    var num_rounds_dialogue = new Dialogue('How many rounds will there be?', input_props);
    num_rounds_dialogue.add_back_listener(back_handler);
    num_rounds_dialogue.add_button_listener(button_handler);
    rounds_screen.appendChild(num_rounds_dialogue.get_element());

    var draft_screen = screen_mgr.add_screen();
    var confirm_screen = screen_mgr.add_screen();
    var finish_screen = screen_mgr.add_screen();
});
