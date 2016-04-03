define(function() {
    var entry = {
        // Get the element from the DOM.
        init: function() {
            this.element = document.getElementById('entry');
            this.set_size();
            window.addEventListener('resize', this.set_size.bind(this));
        },

        // Return the entry element
        get_element: function() {
            return this.element;
        },

        // Revert all CSS to none, delete children.
        clear: function() {
            this.element.setAttribute('style', '');
            while(this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
        },
        set_size: function() {
            var height = window.innerHeight;
            var width = window.innerWidth;
            this.element.style.height = height.toString() + 'px';
            this.element.style.width = width.toString() + 'px';
        }
    };

    entry.init();
    return entry;
});
