const EventObject = require('../utils/event_object');

const COMPLETE_EVENT = 'complete';
const REACHED_BEGINNING_EVENT = 'reached_beginning';
const RESET_EVENT = 'reset';
const READY_EVENT = 'ready';
const NEXT_EVENT = 'next';
const PREVIOUS_EVENT = 'previous';


/*
 * Iterate through a list in snake order for some number of rounds.
 */
class Snake extends EventObject.EventObject {
    constructor(items, rounds) {
        super();
        this.set_items(items || null);
        this.set_rounds(rounds || null);
        this.reset();
    }

    reset() {
        this.index = -1;
        this.increase = true;
        this.rounds_completed = 0;
        this.complete = false;
        this._emit(RESET_EVENT);
        if (this.items != null && this.rounds != null) {
            this.ready = true;
            this._emit(READY_EVENT);
        }
        else {
            this.ready = false;
        }
    }

    is_ready() {
        return this.ready;
    }

    is_complete() {
        return this.complete;
    }

    set_items(items) {
        this.items = items;
        this.reset();
    }

    set_rounds(rounds) {
        this.rounds = rounds;
        this.reset();
    }

    next() {
        if (this.increase) {
            this.index++;
        }
        else {
            this.index--;
        }
        if (this.index >= this.items.length) {
            this.index = this.items.length - 1;
            this.increase = false;
            this.rounds_completed++;
        }
        else if (this.index <= -1) {
            this.index = 0;
            this.increase = true;
            this.rounds_completed++;
        }
        if (this.rounds_completed >= this.rounds) {
            this.complete = true;
            this._emit(COMPLETE_EVENT);
            return;
        }
        else {
            this._emit(NEXT_EVENT, [this.items[this.index]]);
        }
    }

    previous() {
        this.complete = false;
        if (this.rounds_completed === 0 && this.index === -1) {
            this._emit(REACHED_BEGINNING_EVENT);
            return;
        }
        if (this.increase) {
            this.index--;
        }
        else {
            this.index++;
        }
        if (this.index >= this.items.length) {
            this.index = this.items.length - 1;
            this.increase = true;
            this.rounds_completed--;
        }
        else if (this.index <= -1) {
            this.index = 0;
            this.increase = false;
            this.rounds_completed--;
        }
        this._emit(PREVIOUS_EVENT, [this.items[this.index]]);
    }
}


exports.Snake = Snake;
exports.COMPLETE_EVENT = COMPLETE_EVENT;
exports.REACHED_BEGINNING_EVENT = REACHED_BEGINNING_EVENT;
exports.RESET_EVENT = RESET_EVENT;
exports.READY_EVENT = READY_EVENT;
exports.NEXT_EVENT = NEXT_EVENT;
exports.PREVIOUS_EVENT = PREVIOUS_EVENT;
