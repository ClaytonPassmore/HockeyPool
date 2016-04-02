define(function() {
    var snake = {
        init: function() {
            this.entries = [];
            this.popped = [];
        },

        // Add an entry
        add_entry: function(entry) {
            for(var i = 0; i < this.entries.length; i++) {
                if(entry == this.entries[i]) {
                    return -1;
                }
            }
            // Add the entry to the front of the list
            this.entries.splice(0, 0, entry);
            return 0;
        },

        // Remove an entry
        remove_entry: function(entry) {
            for(var i = 0; i < this.entries.length; i++) {
                if(entry == this.entries[i]) {
                    this.entries.splice(i, 1);
                    return 0;
                }
            }
            return -1;
        },

        // Swap an entry
        swap_entry: function(current, newer) {
            for(var i = 0; i < this.entries.length; i++) {
                if(current == this.entries[i]) {
                    this.entries.splice(i, 1, newer);
                    return 0;
                }
            }
            return -1;
        },

        // Clear the snake
        clear: function() {
            this.entries = [];
            this.popped = [];
        },

        // Go to the next turn
        next: function() {
            var candidate = 0;
            if(this.entries.length == 0) {
                this.entries = this.popped;
                this.popped = [];
            }
            candidate = this.entries.pop();
            this.popped.push(candidate);
            return candidate;
        },

        // Go to the previous turn
        previous: function() {
            var candidate = 0;
            if(this.popped.length == 0) {
                this.popped = this.entries;
                this.entries = [];
            }
            candidate = this.popped.pop();
            this.entries.push(candidate);
            return candidate;
        },

        // Get the number of turns left in the round
        num_turns: function() {
            return this.entries.length;
        }
    };

    // Initialize and return.
    snake.init();
    return snake;
});
