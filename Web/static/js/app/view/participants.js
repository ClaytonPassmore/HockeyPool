define(['app/view/draft_container', 'app/view/sidebar', 'app/view/dialogue'],
    function(DraftContainer, Sidebar, Dialogue) {

    var participants = function(num_teams) {
        this.elem = document.createElement('div');
        this.elem.setAttribute('class', 'participant_container');

        this.sidebar = new Sidebar('Teams');
        this.draft_container = new DraftContainer();
        this.dialogue = new Dialogue('Enter name for team #1', {type: 'text'});

        this.dialogue.add_back_listener(this.pop_participant.bind(this));
        this.dialogue.add_button_listener(this.push_participant.bind(this));

        this.draft_container.get_element().appendChild(this.dialogue.get_element());
        this.elem.appendChild(this.sidebar.get_element());
        this.elem.appendChild(this.draft_container.get_element());

        this.back_listeners = [];
        this.submit_listeners = [];
        this.participants = [];
        this.num_teams = num_teams;
        return this;
    };

    participants.prototype.get_element = function() {
        return this.elem;
    };

    participants.prototype.add_back_listener = function(listener) {
        this.back_listeners.push(listener);
    };

    participants.prototype.add_submit_listener = function(listener) {
        this.submit_listeners.push(listener);
    };

    participants.prototype.back_event = function() {
        for(idx in this.back_listeners) {
            this.back_listeners[idx]();
        }
    }

    participants.prototype.submit_event = function() {
        for(idx in this.submit_listeners) {
            this.submit_listeners[idx](this.participants);
        }
    }

    participants.prototype.push_participant = function(participant) {
        if(!participant || participant == '') {
            return;
        }

        this.participants.push(participant);
        this.sidebar.set_items(this.participants);
        this.dialogue.set_input('');

        if(this.participants.length == this.num_teams) {
            this.dialogue.show_input(false);
            this.dialogue.set_input('__filler__');
            this.dialogue.set_title('Does this look right to you?');
        } else if(this.participants.length > this.num_teams) {
            this.participants.pop();  // Remove our filler input
            this.sidebar.set_items(this.participants);
            this.submit_event();
        } else {
            this.dialogue.set_title('Enter name for team #' +
                                    (this.participants.length + 1).toString());
        }
    };

    participants.prototype.pop_participant = function() {
        var popped = this.participants.pop();
        this.sidebar.set_items(this.participants);
        this.dialogue.set_input('');
        if(popped == undefined) {
            this.back_event();
        } else {
            this.dialogue.show_input(true);
            this.dialogue.set_title('Enter name for team #' +
                                    (this.participants.length + 1).toString());
        }
        return popped;
    };

    participants.prototype.set_num_teams = function(num) {
        this.num_teams = num;
    };

    return participants;
});
