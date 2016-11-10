const RATE = 50;
// FIXME:
// Animation rates are wrong because I'm too lazy to figure out how to do the math properly.


function animate(element, property, eventual, duration) {
    return new Promise(function(resolve, reject) {
        if (typeof element.style[property] === 'undefined') {
            throw('Property must be set on element');
        }

        var units_re = /[^0-9]+/;
        var val_re = /[0-9]+/;
        var units = eventual.match(units_re)[0];
        if (units != element.style[property].match(units_re)[0]) {
            throw('Units must match');
        }

        var initial_val = parseFloat(element.style[property].match(val_re)[0]);
        var eventual_val = parseFloat(eventual.match(val_re)[0]);
        var delta = (eventual_val - initial_val) / (duration / RATE);

        function work() {
            var val = parseFloat(element.style[property].match(val_re)) + delta;
            if ((eventual_val > initial_val && val >= eventual_val) ||
                (eventual_val < initial_val && val <= eventual_val))
            {
                element.style[property] = eventual;
                resolve();
                return;
            }
            element.style[property] = val + units;
            setTimeout(work, 1000 / RATE);
        }

        setTimeout(work, 0);
    });
}

exports.animate = animate;
