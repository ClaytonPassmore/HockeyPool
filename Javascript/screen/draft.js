const Screen = require('./screen');
const Title = require('../widget/title');
const Dialogue = require('../widget/dialogue');


class TitleScreen extends Screen.Screen {
    constructor(title) {
        super();
        this.title = new Title.Title(title);
        var title_elem = this.title.get_element();
        title_elem.style.position = 'relative';
        title_elem.style.top = '50%';
        title_elem.style.transform = 'translateY(-50%)';
        title_elem.style.fontSize = '3em';

        var self = this;
        this.element.style.cursor = 'pointer';
        this.element.addEventListener('click', function() {
            self.next();
        });

        this.element.appendChild(title_elem);
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

        var self = this;
        this.dialogue.addEventListener(Dialogue.SUBMIT_EVENT, function(val) {
            if (0 <= val && val <= 10) {
                draft_model.set_rounds(val);
            }
            self.notify('Selected ' + val + ' rounds.');
            self.next();
        });
        this.dialogue.addEventListener(Dialogue.BACK_EVENT, function() {
            self.previous();
        });

        this.element.appendChild(dialogue_elem);
    }

    focus() {
        this.dialogue.picker.focus();
    }
}

exports.TitleScreen = TitleScreen;
exports.RoundsScreen = RoundsScreen;
