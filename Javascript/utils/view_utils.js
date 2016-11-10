const EventObject = require('./event_object');
const SCREEN_NEXT_EVENT = 'screen_next';
const SCREEN_PREVIOUS_EVENT = 'screen_previous';
const NOTIFY_EVENT = 'notify';


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
    constructor(notification_manager) {
        super();
        this.notification_manager = notification_manager || null;
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'screen-container');
        this.screens = [];
        this.screen_instances = [];
        this.current = null;
        this.current_instance = null;

        var self = this;
        this.next_invoker = function() {
            self.next();
        }.bind(this);
        this.previous_invoker = function() {
            self.previous();
        }.bind(this);
        this.notifier = function(message) {
            self.notify(message)
        }.bind(this);

        window.addEventListener('resize', this.set_size.bind(this));
    }

    get_current() {
        return this.current;
    }

    add_screen(screen_instance) {
        var screen = document.createElement('div');
        screen.setAttribute('class', 'screen');
        screen.style.left = '100%';
        this.screens.push(screen);
        this.screen_instances.push(screen_instance);
        this.set_size();

        screen.appendChild(screen_instance.get_element());
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
        this.screen_instances.splice(index, 1);
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
            else {
                throw Error('Must be transition direction');
            }
        }

        if (this.current_instance) {
            this.current_instance.removeEventListener(SCREEN_NEXT_EVENT, this.next_invoker);
            this.current_instance.removeEventListener(SCREEN_PREVIOUS_EVENT, this.previous_invoker);
            this.current_instance.removeEventListener(NOTIFY_EVENT, this.notifier);
        }

        this.current = this.screens[index];
        this.current.style.left = '0';
        this.current_instance = this.screen_instances[index];
        this.current_instance.addEventListener(SCREEN_NEXT_EVENT, this.next_invoker);
        this.current_instance.addEventListener(SCREEN_PREVIOUS_EVENT, this.previous_invoker);
        this.current_instance.addEventListener(NOTIFY_EVENT, this.notifier);
        this.current_instance.focus();
    }

    clear_all() {
        for (var i = 0; i < this.screens.length; i++) {
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
        for (var i = 0; i < this.screens.length; i++) {
            this.screens[i].style.height = height;
            this.screens[i].style.width = width;
        }
    }

    notify(message) {
        if (this.notification_manager != null) {
            this.notification_manager.notify(message);
        }
    }
}


exports.ViewObject = ViewObject;
exports.ScreenManager = ScreenManager;
exports.SCREEN_NEXT_EVENT = SCREEN_NEXT_EVENT;
exports.SCREEN_PREVIOUS_EVENT = SCREEN_PREVIOUS_EVENT;
exports.NOTIFY_EVENT = NOTIFY_EVENT;
