require('babel-polyfill');
const Draft = require('./model/draft');
const Snake = require('./model/snake');
const Selection = require('./model/selection');

function main() {
    var snake = new Snake.Snake();
    var selection_record = new Selection.SelectionRecord();
    var draft = new Draft.Draft(selection_record, snake);
    console.log(draft);
};

main();
