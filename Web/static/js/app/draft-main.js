define(
['app/view/entry',
 'app/view/screen_mgr',
 'app/view/title_span',
 'app/view/dialogue',
 'app/view/participants',
 'app/view/draft',
 'app/view/draft_confirm',
 'app/view/draft_submit',
 'app/model/draft',
 'app/model/draft_submit',
 'app/model/fetch_players',
 'app/model/bloodhound',
 'bloodhound'
],
function(
    Entry,
    ScreenMgr,
    TitleSpan,
    Dialogue,
    Participants,
    Draft,
    DraftConfirm,
    DraftSubmit,
    DraftModel,
    DraftSubmitModel,
    FetchPlayers,
    Bloodhound,
    bloodhound
) {

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

    var draft_model = new DraftModel();
    participants.add_submit_listener(function(participants) {
        draft_model.set_teams(participants);
    });
    num_rounds_dialogue.add_button_listener(function(rounds) {
        draft_model.set_rounds(rounds);
    });


    var draft_screen = screen_mgr.add_screen();
    var player_bloodhound = new Bloodhound([], bloodhound.tokenizers.obj.whitespace('name'));
    var team_bloodhound = new Bloodhound([], bloodhound.tokenizers.obj.whitespace('name'));

    var fetch_players = new FetchPlayers('http://localhost:5000/rest');
    fetch_players.add_listener(function(players, teams) {
        player_bloodhound.set_data(players);
        team_bloodhound.set_data(teams);
    })
    fetch_players.fetch();

    var draft = new Draft(draft_model, player_bloodhound, team_bloodhound);
    draft.add_forward_listener(button_handler);
    draft.add_back_listener(back_handler);
    draft_screen.appendChild(draft.get_element());

    var confirm_screen = screen_mgr.add_screen();
    draft_confirm = new DraftConfirm();
    draft_confirm.add_forward_listener(button_handler);
    draft_confirm.add_back_listener(back_handler);
    draft.add_forward_listener(function(picks) {
        draft_confirm.set_selections(picks);
    });
    draft_confirm.add_back_listener(function() {
        draft.back_handler();
    });
    confirm_screen.appendChild(draft_confirm.get_element());

    // TODO
    var finish_screen = screen_mgr.add_screen();
    var draft_submit_model = new DraftSubmitModel();
    var draft_submit = new DraftSubmit(draft_submit_model);
    draft_confirm.add_forward_listener(function(picks) {
        draft_submit_model.submit(picks);
    });
    finish_screen.appendChild(draft_submit.get_element());
});
