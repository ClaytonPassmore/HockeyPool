const ViewUtils = require('../utils/view_utils');


class Screen extends ViewUtils.ViewObject {
    constructor() {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'full');
    }

    next() {
        this._emit(ViewUtils.SCREEN_NEXT_EVENT);
    }

    previous() {
        this._emit(ViewUtils.SCREEN_PREVIOUS_EVENT);
    }

    focus() {
        /* Called by a screen manager when the screen gains focus. */
    }
}


exports.Screen = Screen;
