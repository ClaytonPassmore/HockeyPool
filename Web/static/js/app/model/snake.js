define(function() {
    var snake = function(items, rounds) {
        this.index = -1;

        var rev_items = [];
        for(var i = 0; i < items.length; i++) {
            rev_items.push(items[i]);
        }
        rev_items.reverse();

        this.order = [];
        for(var i = 0; i < rounds; i++) {
            if(i % 2) {
                this.order = this.order.concat(rev_items);
            } else {
                this.order = this.order.concat(items);
            }
        }

        return this;
    };

    snake.prototype.get_order = function() {
        return this.order;
    }

    snake.prototype.get_index = function() {
        return this.index;
    }

    snake.prototype.get_total = function() {
        return this.order.length;
    }

    snake.prototype.next = function() {
        this.index++;
        if(this.index >= this.order.length) {
            this.index = this.order.length;
            return undefined;
        }
        return this.order[this.index];
    }

    snake.prototype.previous = function() {
        this.index--;
        if(this.index < 0) {
            this.index = -1;
            return undefined;
        }
        return this.order[this.index];
    }

    return snake;
});
