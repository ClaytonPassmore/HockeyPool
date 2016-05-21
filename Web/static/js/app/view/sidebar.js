define(function() {
    var sidebar = function() {
        this.elem = document.createElement("div");
        this.elem.setAttribute('class', 'sidebar');

        this.inner_elem = document.createElement("div");
        this.inner_elem.setAttribute('class', 'inner_sidebar');

        this.title_elem = document.createElement("div");
        this.title_elem.setAttribute('class', 'sidebar_title');

        this.list_container_elem = document.createElement("div");
        this.list_container_elem.setAttribute('class', 'sidebar_list_container')

        this.list_elem = document.createElement('ul');
        this.list_elem.setAttribute('class', 'sidebar_list');

        this.list_container_elem.appendChild(this.list_elem);
        this.inner_elem.appendChild(this.title_elem);
        this.inner_elem.appendChild(this.list_container_elem);
        this.elem.appendChild(this.inner_elem);
        return this
    };

    sidebar.prototype.set_title = function(title) {
        this.title_elem.innerText = title;
    }
    sidebar.prototype.set_items = function(items) {
        while(this.list_elem.firstChild) {
            this.list_elem.removeChild(this.list_elem.firstChild);
        }
        for(idx in items) {
            var li = document.createElement('li');
            li.setAttribute('class', 'sidebar_list_item');
            li.innerText = items[idx];
            this.list_elem.appendChild(li);
        }
    }

    sidebar.prototype.get_element = function() {
        return this.elem;
    };

    sidebar.prototype.set_color = function(color) {
        this.elem.style.background = color;
    };

    sidebar.prototype.set_opacity = function(opacity) {
        this.elem.style.opacity = opacity;
    }

    sidebar.prototype.set_height = function(height) {
        // 40 for position offset
        this.elem.style.height = (height - 40).toString() + 'px';
        // 30 for position offset
        this.inner_elem.style.height = (height - 40 - 30).toString() + 'px';
    }

    return sidebar;
});
