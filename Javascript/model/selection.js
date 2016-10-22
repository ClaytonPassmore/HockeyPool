const EventObject = require('../utils/event_object');

const SELECTION_PUSH_EVENT = 'push';
const SELECTION_POP_EVENT = 'pop';
const RESET_EVENT = 'reset';


/*
 * Keep track of player selections for each draft team.
 */
class SelectionRecord {
    constructor(teams) {
        this.selections = [];
        this.team_selections = {};
        this.set_teams(teams || null);
    }

    reset() {
        if (this.teams != null) {
            for (var idx in this.teams) {
                this.team_selections[this.teams[idx]].reset();
            }
        }
    }

    set_teams(teams) {
        this.teams = teams;
        this.team_selections = {};
        for(var idx in teams) {
            this.team_selections[teams[idx]] = new SelectionList();
        }
    }

    get_selections(team) {
        return this.team_selections[team];
    }

    push_selection(team, player) {
        this.team_selections[team].push(player);
        this.selections.push([team, player]);
    }

    pop_selection() {
        var popped = this.selections.pop();
        if(!popped) {
            return;
        }
        var team_popped = this.team_selections[popped[0]].pop();
        if(popped[1] != team_popped) {
            throw Error('Popped players differ');
        }
        return team_popped;
    }
}


/*
 * A list of selections that emits events when pushed or popped.
 */
class SelectionList extends EventObject.EventObject {
    constructor() {
        super();
        this.selections = [];
    }

    push(item) {
        this.selections.push(item);
        this._emit(SELECTION_PUSH_EVENT, [item]);
    }

    pop() {
        var popped = this.selections.pop();
        this._emit(SELECTION_POP_EVENT, [popped]);
        return popped;
    }

    reset() {
        this.selections = [];
        this._emit(RESET_EVENT);
    }
}


exports.SelectionRecord = SelectionRecord;
exports.SelectionList = SelectionList;
exports.SELECTION_PUSH_EVENT = SELECTION_PUSH_EVENT;
exports.SELECTION_POP_EVENT = SELECTION_POP_EVENT;
exports.RESET_EVENT = RESET_EVENT;
