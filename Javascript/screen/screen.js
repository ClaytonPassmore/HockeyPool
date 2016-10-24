const ViewUtils = require('../utils/view_utils');


class Screen extends ViewUtils.ViewObject {
    constructor(screen_elem) {
        super();
        this.element = screen_elem;
    }

    next() {
        this._emit(ViewUtils.SCREEN_NEXT_EVENT);
    }

    previous() {
        this._emit(ViewUtils.SCREEN_PREVIOUS_EVENT);
    }
}


exports.Screen = Screen;
