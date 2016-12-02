const Screen = require('./screen');
const Title = require('../widget/title');
const Dialogue = require('../widget/dialogue');
const Request = require('../utils/request');

const DRAFT_NAME_AVAILABLE_URL = 'http://localhost:5000/draft/name'


class TitleScreen extends Screen.Screen {
    constructor(title) {
        super();
        this.title = new Title.Title(title);
        var title_elem = this.title.get_element();
        title_elem.style.position = 'relative';
        title_elem.style.top = '50%';
        title_elem.style.transform = 'translateY(-50%)';
        title_elem.style.fontSize = '3em';

        this.element.style.cursor = 'pointer';
        this.element.addEventListener('click', () => {
            this.next();
        });

        this.element.appendChild(title_elem);
    }
}


class NameScreen extends Screen.Screen {
    constructor(draft_model) {
        super();
        this.dialogue = new Dialogue.TextDialogue('Select a name for the draft', 'Draft Name', this.validator);
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
            if (value === null || value.length === 0 || !/^[0-9a-zA-Z ]+$/.test(value)) {
                setTimeout(() => {
                    p.reject();
                }, 0);
            }
            Request.request(DRAFT_NAME_AVAILABLE_URL, {name: value}).then(function() {
                reject();  // Name exists so it is invalid.
            }).catch(function(e) {
                if (e.target.status === 404) {
                    resolve(value);
                }
                else {
                    reject();
                }
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


exports.TitleScreen = TitleScreen;
exports.NameScreen = NameScreen;
exports.RoundsScreen = RoundsScreen;
exports.ParticipantsScreen = ParticipantsScreen;
