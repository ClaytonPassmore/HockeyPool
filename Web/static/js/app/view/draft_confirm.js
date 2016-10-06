define(['app/view/sidebar'], function(Sidebar) {
    var draft_confirm = function(selections) {
        this.forward_listeners = [];
        this.back_listeners = [];

        this.elem = document.createElement('div');
        this.elem.setAttribute('class', 'confirm_container');
        this.picks_container = document.createElement('div');
        this.picks_container.setAttribute('class', 'picks_container');
        this.picks_container.addEventListener('mousewheel', function(e) {
            this.picks_container.scrollLeft += e.deltaY;
        }.bind(this));

        var container = document.createElement('div');
        container.setAttribute('class', 'question_container');
        var question = document.createElement('div');
        question.setAttribute('class', 'inline_question');
        question.innerText = 'Ready to move on?'
        var yes_button = document.createElement('div');
        yes_button.setAttribute('class', 'answer_button button');
        yes_button.innerText = 'Looks good';
        var no_button = document.createElement('div');
        no_button.setAttribute('class', 'answer_button button');
        no_button.innerText = 'Go back';

        yes_button.addEventListener('click', function() {
            this.forward_event();
        }.bind(this));
        no_button.addEventListener('click', function() {
            this.back_event();
        }.bind(this));

        container.appendChild(question);
        container.appendChild(yes_button);
        container.appendChild(no_button);
        this.elem.appendChild(this.picks_container);
        this.elem.appendChild(container);
        this.set_selections(selections || {});
        return this;
    };

    draft_confirm.prototype.get_element = function() {
        return this.elem;
    };

    draft_confirm.prototype.set_selections = function(selections) {
        this.selections = selections;
        if(this.team_lists) {
            for(key in this.team_lists) {
                var elem = this.team_lists[key];
                elem.get_element().parentNode.removeChild(elem.get_element());
            }
        }
        this.team_lists = {};
        for(key in selections) {
            var sidebar = new Sidebar(key, 'inline_block');
            this.team_lists[key] = sidebar;
            sidebar.set_items(selections[key].map(function(item) { return item.name; }));
            this.picks_container.appendChild(sidebar.get_element());
        }
    };

    draft_confirm.prototype.add_forward_listener = function(listener) {
        this.forward_listeners.push(listener);
    };

    draft_confirm.prototype.add_back_listener = function(listener) {
        this.back_listeners.push(listener);
    };

    draft_confirm.prototype.forward_event = function() {
        for(idx in this.forward_listeners) {
            this.forward_listeners[idx](this.selections);
        }
    };

    draft_confirm.prototype.back_event = function() {
        for(idx in this.back_listeners) {
            this.back_listeners[idx]();
        }
    };

    return draft_confirm;
});
