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
    document.getElementsByTagName('body')[0].appendChild(notification_manager.get_element());

    /* Create screens for each step of the draft */
    console.log(notification_manager);
    var screen_mgr = new ViewUtils.ScreenManager(notification_manager);
    var screens = {};
    screens.title = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screens.rounds = screen_mgr.add_screen(new DraftScreens.RoundsScreen(draft));
    screens.participants = screen_mgr.add_screen(new DraftScreens.ParticipantsScreen(draft));
    // TODO: Make actual screen classes for these guys
    screens.selections = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screens.review = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screens.submit = screen_mgr.add_screen(new DraftScreens.TitleScreen(TITLE_TEXT));
    screen_mgr.set_screen(screens.title);

    /* Wiring */
    var entry = document.getElementById('entry');
    entry.appendChild(screen_mgr.get_element());
});
