const EventObject = require('./event_object');


class ViewObject extends EventObject.EventObject {
    constructor() {
        super();
        this.element = null;
    }

    get_element() {
        return this.element;
    }
}


class ScreenManager extends ViewObject {
    constructor() {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'screen_container');
        this.screens = [];
        this.current = null;

        window.addEventListener('resize', this.set_size.bind(this));
    }

    get_current() {
        return this.current;
    }

    add_screen() {
        var screen = document.createElement('div');
        screen.setAttribute('class', 'screen');
        screen.style.left = '100%';
        this.screens.push(screen);
        this.set_size();
        this.element.appendChild(screen);
        return screen;
    }

    next() {
        var index = this.screens.indexOf(this.current);
        if(index < 0 || index === (this.screens.length - 1)) {
            return;
        }
        index++;
        this.set_screen_by_index(index, true);
    }

    previous() {
        var index = this.screens.indexOf(this.current);
        if(index <= 0) {
            return;
        }
        index--;
        this.set_screen_by_index(index, false);
    }

    remove_screen(screen) {
        var index = this.screens.indexOf(screen);
        return this.remove_screen_by_index(index);
    }

    remove_screen_by_index(index) {
        if(this.screens[index] == this.current) {
            this.next();
        }
        this.element.removeChild(this.screens[index]);
        this.screens.splice(index, 1);
        return 0;
    }

    set_screen(screen) {
        var index = this.screens.indexOf(screen);
        return this.set_screen_by_index(index);
    }

    set_screen_by_index(index, forward_transition) {
        if(index == this.screens.indexOf(this.current)) {
            return;
        }

        if(this.current) {
            if (forward_transition === false) {
                this.current.style.left = '100%';
            }
            else if (forward_transition === true) {
                this.current.style.left = '-100%';
            }
        }

        this.current = this.screens[index];
        this.current.style.left = '0';
        return 0;
    }

    clear_all() {
        for(var i = 0; i < this.screens.length; i++) {
            this.screens[i].setAttribute('style', '');
            while(this.screens[i].firstChild) {
                this.screens[i].removeChild(this.screens[i].firstChild);
            }
        }
        this.set_size();
    }

    set_size() {
        var height = window.innerHeight.toString() + 'px';
        var width = window.innerWidth.toString() + 'px';
        for(var i = 0; i < this.screens.length; i++) {
            this.screens[i].style.height = height;
            this.screens[i].style.width = width;
        }
    }
}


exports.ViewObject = ViewObject;
exports.ScreenManager = ScreenManager;
