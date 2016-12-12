const ViewUtils = require('../utils/view_utils');


class AutoCompleteList extends  ViewUtils.ViewObject {
    constructor(input_elem, bloodhound, template_func, text_func) {
        super();
        this.input_elem = input_elem;
        this.bloodhound = bloodhound;
        this.template_func = template_func;
        this.text_func = text_func;
        this.max_results = 5;
        this.selection_index = 0;
        this.id_attr = 'ac-id';
        this.pos_attr = 'ac-pos';
        this.mouse_is_hovering = false;

        var par = input_elem.parentNode;
        if (!par) {
            throw Error('Need parent node to attach to');
        }

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'autocomplete-widget');

        this.element.addEventListener('mouseover', (e) => {
            this.mouse_is_hovering = true;
        });

        this.element.addEventListener('mouseout', (e) => {
            this.mouse_is_hovering = false;
        });

        // Offset width and height do not get populated until the item is attached to the DOM tree
        // so we have to do it later. Yes, this is a dirty hack. Stop judging me.
        setTimeout(() => {
            this.element.style.top = (input_elem.offsetTop + input_elem.offsetHeight) + 'px';
            this.element.style.left = input_elem.offsetLeft + 'px';
            this.element.style.width = input_elem.offsetWidth + 'px';
        }, 0);

        this.input_elem.addEventListener('keyup', (e) => {
            if (e.keyCode === 38) {  // Up arrow
                this.change_selection(-1);
            }
            else if (e.keyCode === 40) {  // Down arrow
                this.change_selection(1);
            }
            else if (e.keyCode === 13 || e.keyCode === 9) {  // Enter key or tab key
                this.substitute_selection();
            }
            else {
                this.update_list();
            }
        });

        this.input_elem.addEventListener('keydown', function(e) {
            if (e.keyCode === 9) {  // Prevent tab away
                e.preventDefault();
            }
        }, true);

        this.input_elem.addEventListener('focus', () => {
            this.show_list();
        });

        this.input_elem.addEventListener('blur', () => {
            if (!this.mouse_is_hovering) {
                this.hide_list();
            }
        });

        this.hover_handler = (e) => {
            var idx_str = e.target.getAttribute(this.pos_attr);
            if (idx_str != null) {
                this.change_selection(parseInt(idx_str) - this.selection_index);
            }
        };

        this.click_handler = (e) => {
            this.substitute_selection();
        };

        par.appendChild(this.element);
    }

    substitute_selection() {
        if (!this.element.firstChild) {
            return;
        }
        var id = this.element.childNodes[this.selection_index].getAttribute(this.id_attr);
        this.input_elem.value = this.text_func(this.bloodhound.get(id)[0]);
        this.input_elem.focus();
        this.input_elem.dispatchEvent(new CustomEvent('keyup', {keyCode: 13}));  // Simulate enter key press
        this.update_list();
        this.hide_list();
    }

    get_selection() {
        if (this.element.firstChild) {
            var id = this.element.childNodes[this.selection_index].getAttribute(this.id_attr);
            return {
                id: id,
                text: this.text_func(this.bloodhound.get(id)[0])
            };
        }
        return null;
    }

    change_selection(delta) {
        if (!this.element.firstChild) {
            return;
        }
        this.element.childNodes[this.selection_index].setAttribute('class', 'autocomplete-element');
        this.selection_index = (this.selection_index + delta + this.element.childNodes.length) % this.element.childNodes.length;
        this.element.childNodes[this.selection_index].setAttribute('class', 'autocomplete-element autocomplete-selected-element');
    }

    hide_list() {
        this.element.style.display = 'none';
    }

    show_list() {
        if (this.element.firstChild) {
            this.element.style.display = 'block';
        }
    }

    update_list() {
        var value = this.input_elem.value;
        this.selection_index = 0;

        while (this.element.firstChild) {
            this.remove_mouse_handlers(this.element.firstChild);
            this.element.removeChild(this.element.firstChild);
        }

        if (!value) {
            this.hide_list();
            return;
        }

        this.bloodhound.search(value, (results) => {
            var upper = results.length > this.max_results ? this.max_results : results.length;
            for (var i = 0; i < upper; i++) {
                var result_node = this.generate_result_node(results[i], i);
                this.element.appendChild(result_node);
            }
            if (upper > 0) {
                this.change_selection(0);
                this.show_list();
            }
        });
    }

    generate_result_node(item, position) {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'autocomplete-element');
        elem.setAttribute(this.id_attr, this.bloodhound.identify(item));
        elem.setAttribute(this.pos_attr, position);
        elem.innerHTML = this.template_func(item);
        this.add_mouse_handlers(elem);
        return elem;
    }

    add_mouse_handlers(element) {
        element.addEventListener('mouseover', this.hover_handler);
        element.addEventListener('click', this.click_handler, true);
    }

    remove_mouse_handlers(element) {
        element.removeEventListener('mouseover', this.hover_handler);
        element.removeEventListener('click', this.click_handler);
    }
}

exports.AutoCompleteList = AutoCompleteList;
