const ViewUtils = require('../utils/view_utils');


class Button extends ViewUtils.ViewObject {
    constructor(text) {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'button-widget');
        this.element.innerText = text;
        var self = this;
        this.element.addEventListener('click', function() {
            self._emit('click');
        });
    }
}


class BoxButton extends Button {
    constructor(text) {
        super(text);
        this.element.className += ' box-button-widget';
    }
}


class LinkButton extends Button {
    constructor(text) {
        super(text);
        this.element.className += ' link-button-widget';
    }
}


exports.Button = Button;
exports.BoxButton = BoxButton;
exports.LinkButton = LinkButton;
