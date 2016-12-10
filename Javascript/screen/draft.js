const Screen = require('./screen');
const Text = require('../widget/text');
const Dialogue = require('../widget/dialogue');
const AutoComplete = require('../widget/autocomplete');
const Request = require('../utils/request');

const DRAFT_NAME_AVAILABLE_URL = 'http://localhost:5000/draft/name'


class TitleScreen extends Screen.Screen {
    constructor(title) {
        super();
        this.element.tabIndex = 0;
        this.title = new Text.Title(title);
        var title_elem = this.title.get_element();
        title_elem.style.position = 'relative';
        title_elem.style.top = '50%';
        title_elem.style.transform = 'translateY(-50%)';
        title_elem.style.fontSize = '3em';

        this.element.style.cursor = 'pointer';
        this.element.addEventListener('click', () => {
            this.next();
        });
        this.element.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                this.next();
            }
        });

        this.element.appendChild(title_elem);
    }

    focus() {
        this.element.focus();
    }
}


class NameScreen extends Screen.Screen {
    constructor(draft_model) {
        super();
        this.dialogue = new Dialogue.TextDialogue('Select a name for the draft', 'Draft name', this.validator);
        var dialogue_elem = this.dialogue.get_element();
        dialogue_elem.style.position = 'relative';
        dialogue_elem.style.top = '50%';
        dialogue_elem.style.left = '50%';
        dialogue_elem.style.transform = 'translate(-50%, -50%)';

        this.dialogue.addEventListener(Dialogue.SUBMIT_EVENT, (val) => {
            draft_model.set_name(val);
            this.notify('Selected draft name "' + val + '".');
            this.next();
        });
        this.dialogue.addEventListener(Dialogue.BACK_EVENT, () => {
            this.previous();
        });

        this.element.appendChild(dialogue_elem);
    }

    validator(value) {
        return new Promise(function(resolve, reject) {
            if (value === null || value.length === 0 || !/^[0-9a-zA-Z \-_]+$/.test(value)) {
                setTimeout(() => {
                    reject();
                }, 0);
                return;
            }
            Request.request(DRAFT_NAME_AVAILABLE_URL, {name: value}).then(function(response_text) {
                if (response_text === 'available') {
                    resolve(value);
                }
                else {
                    reject();
                }
            }).catch(function(e) {
                reject();
            });
        });
    }

    focus() {
        this.dialogue.reset();
    }
}


class RoundsScreen extends Screen.Screen {
    constructor(draft_model) {
        super();
        this.dialogue = new Dialogue.NumberDialogue('How many rounds will there be?', 0, null, 10);
        var dialogue_elem = this.dialogue.get_element();
        dialogue_elem.style.position = 'relative';
        dialogue_elem.style.top = '50%';
        dialogue_elem.style.left = '50%';
        dialogue_elem.style.transform = 'translate(-50%, -50%)';

        this.dialogue.addEventListener(Dialogue.SUBMIT_EVENT, (val) => {
            if (0 <= val) {
                draft_model.set_rounds(val);
            }
            this.notify('Selected ' + val + ' rounds.');
            this.next();
        });
        this.dialogue.addEventListener(Dialogue.BACK_EVENT, () => {
            this.previous();
        });

        this.element.appendChild(dialogue_elem);
    }

    focus() {
        this.dialogue.reset();
    }
}


class ParticipantsScreen extends Screen.Screen {
    constructor(draft_model) {
        super();
        this.draft_model = draft_model;
        this.number_dialogue = new Dialogue.NumberDialogue('How many participants will there be?', 1, null, 5);
        var dialogue_elem = this.number_dialogue.get_element();
        dialogue_elem.style.position = 'relative';
        dialogue_elem.style.top = '50%';
        dialogue_elem.style.left = '50%';
        dialogue_elem.style.transform = 'translate(-50%, -50%)';
        this.number_of_participants = null;

        this.number_dialogue.addEventListener(Dialogue.SUBMIT_EVENT, (val) => {
            if (1 <= val) {
                this.number_of_participants = val;
            }
            this.notify('Selected ' + val + ' participants.');
            this.draft_model.set_teams(['Clayton', 'Scott', 'Luc', 'Devin']);
            this.next();
            // XXX
        });
        this.number_dialogue.addEventListener(Dialogue.BACK_EVENT, () => {
            this.previous();
        });

        this.active_dialogue_input = this.number_dialogue.picker;
        this.element.appendChild(dialogue_elem);
    }

    focus() {
        this.active_dialogue_input.focus();
    }
}



class SelectionScreen extends Screen.Screen {
    constructor(draft_model) {
        super();
        this.most_recent_selection_id = null;
        this.most_recent_selection_text = null;
        this.draft_model = draft_model;
        this.dialogue = new Dialogue.TextDialogue('Test', 'Selection', this.validator.bind(this));
        this.element.appendChild(this.dialogue.get_element());

        // TODO:
        // Drawer widget
        // Selection list
        // Snake preview widget

        var template_func = function(item) {
            return '<div>' + item.playerName + ' (' + item.playerPositionCode + ') - ' + item.teamAbbrev + '</div>';
        };
        var text_func = function(item) {
            return item.playerName;
        }
        this.ac = new AutoComplete.AutoCompleteList(this.dialogue.picker,
                                                    this.draft_model.bloodhound.get_bloodhound(),
                                                    template_func,
                                                    text_func);

        this.dialogue.addEventListener(Dialogue.BACK_EVENT, () => {
            this.previous();
        });

        this.dialogue.addEventListener(Dialogue.SUBMIT_EVENT, (val) => {
            var item = this.ac.get_selection();
            if (item === null) {
                return;
            }
            this.draft_model.bloodhound.remove(item.id);
            this.dialogue.reset();
            this.ac.update_list();
            console.log(item.text);  // XXX
        });
    }

    validator(value) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var item = this.ac.get_selection();
                if (item === null) {
                    reject(value);
                }
                else if (value === item.text) {
                    resolve(value);
                }
                else {
                    reject(value);
                }
            }, 0);
        });
    }

    focus() {
        this.dialogue.reset();
        this.ac.update_list();
    }
}


exports.TitleScreen = TitleScreen;
exports.NameScreen = NameScreen;
exports.RoundsScreen = RoundsScreen;
exports.ParticipantsScreen = ParticipantsScreen;
exports.SelectionScreen = SelectionScreen;
