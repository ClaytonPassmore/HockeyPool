const ViewUtils = require('../utils/view_utils');
const Title = require('./title');
const Button = require('./button');

const SUBMIT_EVENT = 'submit';
const BACK_EVENT = 'back';


class NumberDialogue extends ViewUtils.ViewObject {
    constructor(title, min, max, default_val) {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'dialogue-widget');
        var title_widget = new Title.Title(title);
        title_widget.get_element().style.fontSize = '2em';

        var picker = document.createElement('input');
        picker.setAttribute('type', 'number');
        picker.style.fontSize = '4em';
        picker.style.textAlign = 'right';
        picker.style.width = '100px';
        picker.style.margin = '20px auto';
        picker.style.display = 'block';
        if (min != null) {
            picker.setAttribute('min', min);
        }
        if (max != null) {
            picker.setAttribute('max', max);
        }
        if (default_val != null) {
            picker.setAttribute('value', default_val);
        }

        var button_container = document.createElement('div');
        button_container.style.width = '100%';
        button_container.style.height = '30px';
        button_container.style.position = 'relative';

        var submit = new Button.BoxButton('Submit');
        var submit_elem = submit.get_element();
        submit_elem.style.fontSize = '1.5em';
        submit_elem.style.position = 'absolute';
        submit_elem.style.right = 0;

        var back = new Button.LinkButton('Back');
        var back_elem = back.get_element();
        back_elem.style.fontSize = '1.5em';
        back_elem.style.position = 'absolute';
        back_elem.style.left = 0;

        var self = this;
        submit.addEventListener('click', function() {
            self._emit(SUBMIT_EVENT, [picker.value]);
        });
        back.addEventListener('click', function() {
            self._emit(BACK_EVENT);
        });

        button_container.appendChild(back_elem);
        button_container.appendChild(submit_elem);
        this.element.appendChild(title_widget.get_element());
        this.element.appendChild(picker);
        this.element.appendChild(button_container);
    }
}


exports.NumberDialogue = NumberDialogue;
exports.SUBMIT_EVENT = SUBMIT_EVENT;
exports.BACK_EVENT = BACK_EVENT;
