/*
 * Base class for registering and calling event listeners.
 */
class EventObject {

    constructor() {
        this.listeners = {};
    }

    addEventListener(event_name, listener) {
        if (typeof this.listeners[event_name] === 'undefined') {
            this.listeners[event_name] = [];
        }
        this.listeners[event_name].push(listener);
    }

    removeEventListener(event_name, listener) {
        var idx = this.listeners[event_name].indexOf(listener);
        this.listeners[event_name].splice(idx, 1);
    }

    _emit(event_name, args) {
        if (typeof this.listeners[event_name] === 'undefined') {
            return;
        }
        var self = this;
        for (var idx in this.listeners[event_name]) {
            setTimeout((function(n, i) {
                return function() {
                    self.listeners[n][i].apply(null, args);
                }
            })(event_name, idx), 0);
        }
    }
}


exports.EventObject = EventObject;
