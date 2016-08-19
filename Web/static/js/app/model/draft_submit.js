define(function() {
    var draft_submit = function() {
        this.url = 'http://localhost:5000/submit';
        this.listeners = [];
        return this;
    };

    draft_submit.prototype.add_event_listener = function(listener) {
        this.listeners.push(listener);
    };

    draft_submit.prototype.call_listeners = function(error) {
        for(var idx in this.listeners) {
            this.listeners[idx](error);
        }
    };

    draft_submit.prototype.submit = function(data) {
        this.xml = new XMLHttpRequest();
        this.xml.onreadystatechange = this.callback.bind(this);
        this.xml.timeout = 5000;
        this.xml.open('post', this.url, true);
        this.xml.send(data);
    };

    draft_submit.prototype.callback = function(e) {
        if(e.target.readyState == 4 && e.target.status == 200) {
            this.call_listeners(false);
        } else {
            this.call_listeners(true);
        }
    };

    return draft_submit;
});
