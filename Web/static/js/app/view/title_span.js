define(function() {
    var title_span = function(title) {
        this.elem = document.createElement('div');
        this.elem.setAttribute('class', 'title_span');
        this.title_elem = document.createElement('div');
        this.title_elem.setAttribute('class', 'title_span_title');

        this.elem.appendChild(this.title_elem);
        this.set_title(title);
        return this;
    };

    title_span.prototype.get_element = function() {
        return this.elem;
    };

    title_span.prototype.set_title = function(title) {
        this.title_elem.innerText = title;
    }

    return title_span;
});
