const Screen = require('./screen');
const Title = require('../widget/title');


class TitleScreen extends Screen.Screen {
    constructor(screen_elem) {
        super(screen_elem);
        this.title = new Title.Title('Welcome to the draft.');

        var self = this;
        this.element.style.cursor = 'pointer';
        this.element.addEventListener('click', function() {
            self.next();
        });

        this.element.appendChild(this.title.get_element());
    }
}


exports.TitleScreen = TitleScreen;
