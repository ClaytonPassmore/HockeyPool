const EventObject = require('../utils/event_object');
const Snake = require('./snake');
const request = require('../utils/request').request;

const SUBMIT_URL = 'http://localhost:5000/submit';
const READY_EVENT = 'ready';
const RESET_EVENT = 'reset';
const COMPLETE_EVENT = 'complete';


class Draft extends EventObject.EventObject {
    constructor(selection_record, snake) {
        super();
        this.selection_record = selection_record;
        this.snake = snake;
        this.current_selector = null;

        // Event Listeners
        var self = this;
        this.snake.addEventListener(Snake.COMPLETE_EVENT, function() {
            self._emit(COMPLETE_EVENT);
        });
        this.snake.addEventListener(Snake.READY_EVENT, function() {
            self.snake.next();
            self._emit(READY_EVENT);
        });
        this.snake.addEventListener(Snake.NEXT_EVENT, function(selector) {
            self.current_selector = selector;
        });
        this.snake.addEventListener(Snake.PREVIOUS_EVENT, function(selector) {
            self.current_selector = selector;
        });
        this.snake.addEventListener(Snake.RESET_EVENT, function() {
            self.selection_record.reset();
            self._emit(RESET_EVENT);
        });
    }

    set_teams(teams) {
        this.selection_record.set_teams(teams);
        this.snake.set_items(teams);
    }

    set_rounds(rounds) {
        this.snake.set_rounds(rounds);
    }

    make_selection(selector, player) {
        if (!this.snake.is_ready()) {
            throw Error('Teams and rounds must be set before making selections');
        }
        if (this.current_selector === null) {
            throw Error('No current selector set');
        }
        else if (this.current_selector != selector) {
            throw Error('Not ' + selector + '\'s turn');
        }

        this.selection_record.push_selection(selector, player);
        this.current_selector = null;
        this.snake.next();
    }

    undo_selection() {
        if (!this.snake.is_ready()) {
            throw Error('Teams and rounds must be set before making selections');
        }
        this.selection_record.pop_selection();
        this.current_selector = null;
        this.snake.previous();
    }

    submit_selections_async() {
        if (!this.snake.is_complete()) {
            throw Error('Cannot submit until selection process is complete');
        }
        var selections = {};
        var teams = this.selection_record.teams;
        for (var idx in teams) {
            selections[teams[idx]] = this.selection_record.get_selections(teams[idx]).selections;
        }

        var selection_data = JSON.stringify(selections);
        return request(SUBMIT_URL, selection_data);
    }
}


exports.Draft = Draft;
exports.READY_EVENT = READY_EVENT;
exports.RESET_EVENT = RESET_EVENT;
exports.COMPLETE_EVENT = COMPLETE_EVENT;
