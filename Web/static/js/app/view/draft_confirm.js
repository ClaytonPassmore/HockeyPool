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

        this.elem.appendChild(this.picks_container);
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
