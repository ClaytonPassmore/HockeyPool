const ViewUtils = require('../utils/view_utils');

const Text = require('./text');
const Button = require('./button');

const ACTION_EVENT = 'action';
const RETRY_ACTION = 'retry';


class Popup extends ViewUtils.ViewObject {
    constructor(title, message) {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'popup-widget-background');
        this.popup = document.createElement('div');
        this.popup.setAttribute('class', 'popup-widget');
        var title_widget = new Text.Title(title);
        var title_elem = title_widget.get_element();
        title_elem.style.fontSize = '1.8em';
        var paragraph_widget = new Text.Paragraph(message);
        var paragraph_elem = paragraph_widget.get_element();
        paragraph_elem.style.fontSize = '1.3em';
        paragraph_elem.style.marginTop = '10px';

        this.popup.appendChild(title_elem);
        this.popup.appendChild(paragraph_elem);
        this.element.appendChild(this.popup);
    }
}


class RetryPopup extends Popup {
    constructor(title, message) {
        super(title, message);

        var button_container = document.createElement('div');
        button_container.style.width = '100%';
        button_container.style.textAlign = 'center';
        button_container.style.marginTop = '10px';
        button_container.style.fontSize = '1.3em';
        
        var retry = new Button.BoxButton('Retry');
        retry.addEventListener('click', () => {
            this._emit(ACTION_EVENT, [RETRY_ACTION]);
        });

        button_container.appendChild(retry.get_element());
        this.popup.appendChild(button_container);
    }
}


const Popups = {
    'retry': RetryPopup
};


exports.Popups = Popups;
exports.RetryPopup = RetryPopup;
exports.RETRY_ACTION = RETRY_ACTION;
exports.ACTION_EVENT = ACTION_EVENT;
