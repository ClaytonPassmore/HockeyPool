define(function() {
    var queue = function(items) {
        this.elem = document.createElement('div');
        this.elem.setAttribute('class', 'queue_container');
        this.set_items(items || []);
        return this;
    };

    queue.prototype.get_element = function() {
        return this.elem;
    };

    queue.prototype.set_items = function(items) {
        this.queue = items;
        this.queue_elems = [];
        this.current_index = 0;

        while(this.elem.firstChild) {
            this.elem.removeChild(this.elem.firstChild);
        }

        for(idx in items) {
            var elem = document.createElement('div');
            elem.setAttribute('class', 'queue_item');
            if(idx == 0) {
                elem.setAttribute('class', 'queue_item active_queue_item');
            }
            elem.innerText = items[idx];
            this.elem.appendChild(elem);
            this.queue_elems.push(elem);
        }
    };

    queue.prototype.forward = function() {
        this.queue_elems[this.current_index].style.display = 'none';
        this.queue_elems[this.current_index].setAttribute('class', 'queue_item');
        this.current_index = this.current_index < (this.queue_elems.length - 1) ?
            this.current_index + 1 : this.current_index;
        this.queue_elems[this.current_index].setAttribute('class', 'queue_item active_queue_item');
    };

    queue.prototype.back = function() {
        this.queue_elems[this.current_index].setAttribute('class', 'queue_item');
        this.current_index = this.current_index > 0 ? this.current_index - 1 : this.current_index;
        this.queue_elems[this.current_index].style.display = '';
        this.queue_elems[this.current_index].setAttribute('class', 'queue_item active_queue_item');
    };

    return queue;
});
