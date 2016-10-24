require('babel-polyfill');
const Draft = require('./model/draft');
const Snake = require('./model/snake');
const Selection = require('./model/selection');
const Bloodhound = require('./model/bloodhound');
const ViewUtils = require('./utils/view_utils');
const TitleScreen = require('./screen/title');


window.addEventListener('load', function() {
    /* Create models */
    var snake = new Snake.Snake();
    var selection_record = new Selection.SelectionRecord();
    var bloodhound = new Bloodhound.Bloodhound();
    var draft = new Draft.Draft(selection_record, snake, bloodhound);

    /* Create screens for each step of the draft */
    var screen_mgr = new ViewUtils.ScreenManager();
    var screens = {};
    screens.title = screen_mgr.add_screen(TitleScreen.TitleScreen);
    screens.rounds = screen_mgr.add_screen(TitleScreen.TitleScreen);
    screens.participants = screen_mgr.add_screen(TitleScreen.TitleScreen);
    screens.selections = screen_mgr.add_screen(TitleScreen.TitleScreen);
    screens.review = screen_mgr.add_screen(TitleScreen.TitleScreen);
    screens.submit = screen_mgr.add_screen(TitleScreen.TitleScreen);
    screen_mgr.set_screen(screens.title.get_element());

    /* Create views */

    /* Wiring */
    var entry = document.getElementById('entry');
    entry.appendChild(screen_mgr.get_element());
});
