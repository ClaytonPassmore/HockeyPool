const Screen = require('./screen');
const Title = require('../widget/title');


class TitleScreen extends Screen.Screen {
    constructor(title) {
        super();
        this.title = new Title.Title(title);
        var title_elem = this.title.get_element();
        title_elem.style.position = 'relative';
        title_elem.style.top = '50%';
        title_elem.style.transform = 'translateY(-50%)';

        var self = this;
        this.element.style.cursor = 'pointer';
        this.element.addEventListener('click', function() {
            self.next();
        });

        this.element.appendChild(title_elem);
    }
}


exports.TitleScreen = TitleScreen;
