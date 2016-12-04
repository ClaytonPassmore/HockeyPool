require('babel-polyfill');
const Draft = require('./model/draft');
const Snake = require('./model/snake');
const Selection = require('./model/selection');
const Bloodhound = require('./model/bloodhound');
const ViewUtils = require('./utils/view_utils');
const DraftScreens = require('./screen/draft');
const Notify = require('./utils/notify');

const TITLE_TEXT = 'Welcome to the draft.';


window.addEventListener('load', function() {
    /* Create models */
    var snake = new Snake.Snake();
    var selection_record = new Selection.SelectionRecord();
    var bloodhound = new Bloodhound.Bloodhound();
    var draft = new Draft.Draft(selection_record, snake, bloodhound);

    /* Create notification manager */
    var notification_manager = new Notify.NotificationManager();
    draft.addEventListener(Draft.LOAD_FAILURE_EVENT, () => {
        notification_manager.popup(
            'Failed to load draft options',
            'There was a problem downloading the available players and teams from our servers. ' +
            'Please make sure you are connected to a reliable network! ' +
            'If the problem persists, we may have screwed up.',
            () => {
                draft.get_options_async();
            },
            'retry'
        );
    })

    /* Create screens for each step of the draft */
    var screen_mgr = new ViewUtils.ScreenManager(notification_manager);
    var screens = {};
    screens.title = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screens.name = screen_mgr.add_screen(new DraftScreens.NameScreen(draft));
    screens.rounds = screen_mgr.add_screen(new DraftScreens.RoundsScreen(draft));
    screens.participants = screen_mgr.add_screen(new DraftScreens.ParticipantsScreen(draft));
    // TODO: Make actual screen classes for these guys
    screens.selections = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screens.review = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screens.submit = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screen_mgr.set_screen(screens.title);

    /* Wiring */
    var entry = document.getElementById('entry');
    entry.appendChild(notification_manager.get_element());
    entry.appendChild(screen_mgr.get_element());
    screen_mgr.focus_current();
});
