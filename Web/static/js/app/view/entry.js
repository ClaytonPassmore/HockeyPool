define(function() {
    var entry = function() {
        this.elem = document.getElementById('entry');
        window.addEventListener('resize', this.set_size.bind(this));
        return this;
    };

    entry.prototype.get_element = function() {
        return this.elem;
    };

    entry.prototype.set_size = function() {
        var height = window.innerHeight;
        var width = window.innerWidth;
        this.elem.style.height = height.toString() + 'px';
        this.elem.style.width = width.toString() + 'px';
    };

    entry.prototype.clear = function() {
        while(this.elem.firstChild) {
            this.elem.removeChild(this.elem.firstChild);
        }
    };

    return entry;
});
