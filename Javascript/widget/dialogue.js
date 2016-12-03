const ViewUtils = require('../utils/view_utils');
const Title = require('./title');
const Button = require('./button');

const SUBMIT_EVENT = 'submit';
const BACK_EVENT = 'back';


class TextDialogue extends ViewUtils.ViewObject {
    constructor(title, placeholder, validator) {
        super();
        this.validator = validator;
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'dialogue-widget');
        var title_widget = new Title.Title(title);
        var title_widget_elem = title_widget.get_element();
        title_widget.get_element().style.fontSize = '2em';

        this.picker = document.createElement('input');
        this.picker.setAttribute('type', 'text');
        this.picker.setAttribute('placeholder', placeholder);
        this.picker.style.fontSize = '1.5em';
        this.picker.style.textAlign = 'left';
        this.picker.style.width = '100%';
        this.picker.style.margin = '20px auto';
        this.picker.style.display = 'block';
        this.picker.style.boxSizing = 'border-box'

        var icon_container = document.createElement('div');
        icon_container.style.width = '100%';
        icon_container.style.textAlign = 'center';
        this.status_icon = document.createElement('i');
        this.show_x();
        icon_container.appendChild(this.status_icon);

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

        submit.addEventListener('click', () => {
            var val = this.picker.value;
            this.validator(val).then(() => {
                this.show_checkmark();
                this._emit(SUBMIT_EVENT, [val]);
            }).catch(() => {
                this.show_x();
            });
        });
        back.addEventListener('click', () => {
            this._emit(BACK_EVENT);
        });
        this.picker.addEventListener('keyup', (e) => {
            var val = this.picker.value;
            if (val === '') {
                this.show_x();
                return;
            }
            this.validator(val).then(() => {
                this.show_checkmark();
                if (e.keyCode === 13) {
                    this._emit(SUBMIT_EVENT, [val]);
                }
            }).catch(() => {
                this.show_x();
            });
        });

        button_container.appendChild(back_elem);
        button_container.appendChild(submit_elem);
        this.element.appendChild(title_widget.get_element());
        this.element.appendChild(this.picker);
        this.element.appendChild(icon_container);
        this.element.appendChild(button_container);
    }

    show_checkmark() {
        this.status_icon.setAttribute('class', 'fa fa-check-circle fa-2x');
    }

    show_x() {
        this.status_icon.setAttribute('class', 'fa fa-times-circle fa-2x');
    }

    reset() {
        this.picker.value = '';
        this.picker.focus();
        this.show_x();
    }
}


class NumberDialogue extends ViewUtils.ViewObject {
    constructor(title, min, max, default_val) {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'dialogue-widget');
        var title_widget = new Title.Title(title);
        title_widget.get_element().style.fontSize = '2em';

        this.picker = document.createElement('input');
        this.picker.setAttribute('type', 'number');
        this.picker.style.fontSize = '4em';
        this.picker.style.textAlign = 'right';
        this.picker.style.width = '100px';
        this.picker.style.margin = '20px auto';
        this.picker.style.display = 'block';
        if (min != null) {
            this.picker.setAttribute('min', min);
        }
        if (max != null) {
            this.picker.setAttribute('max', max);
        }
        if (default_val != null) {
            this.picker.setAttribute('value', default_val);
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

        submit.addEventListener('click', () => {
            this._emit(SUBMIT_EVENT, [this.picker.value]);
        });
        back.addEventListener('click', () => {
            this._emit(BACK_EVENT);
        });
        this.picker.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                this._emit(SUBMIT_EVENT, [this.picker.value]);
            }
        });

        button_container.appendChild(back_elem);
        button_container.appendChild(submit_elem);
        this.element.appendChild(title_widget.get_element());
        this.element.appendChild(this.picker);
        this.element.appendChild(button_container);
    }

    reset() {
        this.picker.focus();
    }
}


exports.TextDialogue = TextDialogue;
exports.NumberDialogue = NumberDialogue;
exports.SUBMIT_EVENT = SUBMIT_EVENT;
exports.BACK_EVENT = BACK_EVENT;
