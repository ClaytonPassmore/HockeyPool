define(function() {
    var draft_container = function() {
        this.elem = document.createElement('div');
        this.elem.setAttribute('class', 'draft_container');
        return this;
    };

    draft_container.prototype.get_element = function() {
        return this.elem;
    };

    return draft_container;
});
