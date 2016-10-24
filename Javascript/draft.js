require('babel-polyfill');
const Draft = require('./model/draft');
const Snake = require('./model/snake');
const Selection = require('./model/selection');
const Bloodhound = require('./model/bloodhound');
const ViewUtils = require('./utils/view_utils');


window.addEventListener('load', function() {
    var snake = new Snake.Snake();
    var selection_record = new Selection.SelectionRecord();
    var bloodhound = new Bloodhound.Bloodhound();
    var draft = new Draft.Draft(selection_record, snake, bloodhound);
    console.log(draft);

    var screen_mgr = new ViewUtils.ScreenManager();
    var entry = document.getElementById('entry');
    entry.appendChild(screen_mgr.get_element());
});
