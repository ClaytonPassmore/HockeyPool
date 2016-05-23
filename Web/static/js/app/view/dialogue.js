define(function() {
    var dialogue = function(title, input_attrs) {
        this.elem = document.createElement('div');
        this.elem.setAttribute('class', 'dialogue');
        this.inner_elem = document.createElement('class', 'dialogue');
        this.inner_elem.setAttribute('class', 'dialogue_inner');
        this.title_elem = document.createElement('div');
        this.title_elem.setAttribute('class', 'dialogue_title');
        this.input_elem = document.createElement('input');
        this.input_elem.setAttribute('class', 'dialogue_input');
        this.button_elem = document.createElement('div');
        this.button_elem.setAttribute('class', 'dialogue_button');
        this.back_elem = document.createElement('div');
        this.back_elem.setAttribute('class', 'dialogue_back');

        this.set_title(title);
        for(key in input_attrs) {
            this.input_elem.setAttribute(key, input_attrs[key]);
        }
        this.button_elem.innerText = 'Submit';
        this.back_elem.innerText = 'Go Back';

        this.elem.appendChild(this.inner_elem);
        this.inner_elem.appendChild(this.title_elem);
        this.inner_elem.appendChild(this.input_elem);
        this.inner_elem.appendChild(this.button_elem);
        this.inner_elem.appendChild(this.back_elem);

        this.button_listeners = [];
        this.back_listeners = [];
        this.button_elem.addEventListener('click', this.button_event.bind(this));
        this.back_elem.addEventListener('click', this.back_event.bind(this));
        return this;
    };

    dialogue.prototype.get_element = function() {
        return this.elem;
    };

    dialogue.prototype.set_title = function(title) {
        this.title_elem.innerText = title;
    };

    dialogue.prototype.add_back_listener = function(func) {
        this.back_listeners.push(func);
    };

    dialogue.prototype.add_button_listener = function(func) {
        this.button_listeners.push(func);
    };

    dialogue.prototype.button_event = function() {
        for(idx in this.button_listeners) {
            this.button_listeners[idx].call();
        }
    };

    dialogue.prototype.back_event = function() {
        for(idx in this.back_listeners) {
            this.back_listeners[idx].call();
        }
    };

    return dialogue;
});
