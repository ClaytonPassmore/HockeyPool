define(['app/view/entry'], function(entry) {
    var screen_mgr = function() {
        this.entry = entry;
        this.element = entry.get_element();
        this.screens = [];
        this.current = null;

        // Create initial screen
        this.add_screen();
        this.set_screen_by_index(0);

        // Add listener for resize events
        window.addEventListener('resize', this.set_size.bind(this));
        return this;
    };

    /* Get the current screen */
    screen_mgr.prototype.get_current = function() {
        return this.current;
    };

    /* Add a new screen and return it */
    screen_mgr.prototype.add_screen = function() {
        var screen = document.createElement('div');
        screen.setAttribute('class', 'screen');
        screen.style.display = 'none';
        this.screens.push(screen);
        this.set_size();
        this.element.appendChild(screen);
        return screen;
    };

    /* Set next screen as current */
    screen_mgr.prototype.next = function() {
        var index = this.screens.indexOf(this.current);
        if(index < 0) {
            index = this.screens.length - 1;
        }
        index = (index + 1) % this.screens.length;
        this.set_screen_by_index(index);
    };

    /* Set previous screen as current */
    screen_mgr.prototype.previous = function() {
        var index = this.screens.indexOf(this.current);
        if(index < 0) {
            index = this.screens.length - 1;
        }
        index = (index + this.screens.length - 1) % this.screens.length;
        this.set_screen_by_index(index);
    };

    /* Remove the specified screen */
    screen_mgr.prototype.remove_screen = function(screen) {
        var index = this.screens.indexOf(screen);
        return this.remove_screen_by_index(index);
    };

    screen_mgr.prototype.remove_screen_by_index = function(index) {
        if(index < 0 || index >= this.screens.length) {
            return -1;
        }
        if(this.screens[index] == this.current) {
            this.next();
        }
        this.screens.splice(index, 1);
        return 0;
    };

    /* Set the current screen */
    screen_mgr.prototype.set_screen = function(screen) {
        var index = this.screens.indexOf(screen);
        if(index < 0) {
            return -1;
        }
        return this.set_screen_by_index(index);
    };

    /* Set the current screen based on array index */
    screen_mgr.prototype.set_screen_by_index = function(index) {
        // Bounds check
        if(index < 0 || index >= this.screens.length) {
            return -1;
        }
        // If index points to current, just leave it
        if(index == this.screens.indexOf(this.current)) {
            return 1;
        }
        // Hide current, show screen to be set
        if(this.current) {
            this.current.style.display = 'none';
        }
        this.current = this.screens[index];
        this.current.style.display = 'block';
        return 0;
    };

    /* Revert all screens to just the screen element */
    screen_mgr.prototype.clear_all = function() {
        for(var i = 0; i < this.screens.length; i++) {
            this.screens[i].setAttribute('style', '');
            while(this.screens[i].firstChild) {
                this.screens[i].removeChild(this.screens[i].firstChild);
            }
        }
        this.set_size();
    };

    /* Set the size of every screen to be the size of the window */
    screen_mgr.prototype.set_size = function() {
        var height = window.innerHeight.toString() + 'px';
        var width = window.innerWidth.toString() + 'px';
        for(var i = 0; i < this.screens.length; i++) {
            this.screens[i].style.height = height;
            this.screens[i].style.width = width;
        }
    };

    return screen_mgr;
});
