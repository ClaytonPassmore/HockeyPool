const ViewUtils = require('../utils/view_utils');


class Title extends ViewUtils.ViewObject {
    constructor(title_text) {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'title-widget');
        this.element.innerText = title_text;
    }
}


exports.Title = Title;
