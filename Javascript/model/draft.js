const EventObject = require('../utils/event_object');
const Snake = require('./snake');
const request = require('../utils/request').request;

const SUBMIT_URL = 'http://localhost:5000/draft/submit';
const PLAYERS_URL = 'http://localhost:5000/draft/players';
const READY_EVENT = 'ready';
const RESET_EVENT = 'reset';
const COMPLETE_EVENT = 'complete';
const SUBMIT_SUCCESS_EVENT = 'submit_success';
const SUBMIT_FAILURE_EVENT = 'submit_failure';
const LOAD_FAILURE_EVENT = 'load_failure';


class Draft extends EventObject.EventObject {
    constructor(selection_record, snake, bloodhound) {
        super();
        this.selection_record = selection_record;
        this.snake = snake;
        this.bloodhound = bloodhound;
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

        this.get_options_async();
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

        var self = this;
        var selection_data = JSON.stringify(selections);
        request(SUBMIT_URL, selection_data).then(function() {
            self._emit(SUBMIT_SUCCESS_EVENT);
        }).catch(function(err) {
            self._emit(SUBMIT_FAILURE_EVENT);
        });
    }

    get_options_async() {
        var self = this;
        request(PLAYERS_URL).then(function(values) {
            self.bloodhound.set_data(JSON.parse(values));
        }).catch(function(err) {
            self._emit(LOAD_FAILURE_EVENT, [err])
        });
    }
}


exports.Draft = Draft;
exports.READY_EVENT = READY_EVENT;
exports.RESET_EVENT = RESET_EVENT;
exports.COMPLETE_EVENT = COMPLETE_EVENT;
exports.SUBMIT_SUCCESS_EVENT = SUBMIT_SUCCESS_EVENT;
exports.SUBMIT_FAILURE_EVENT = SUBMIT_FAILURE_EVENT;
exports.LOAD_FAILURE_EVENT = LOAD_FAILURE_EVENT;
