const ViewUtils = require('./view_utils');
const Animate = require('./animate');

const TIMEOUT = 5000;
const ANIMATION_DURATION = 300;


class NotificationManager extends ViewUtils.ViewObject {
    constructor() {
        super();
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'notification-manager-widget');
        this.notifications = [];
    }

    notify(message) {
        if (typeof message === 'undefined') {
            return;
        }
        var notification = document.createElement('div');
        notification.setAttribute('class', 'notification-widget');
        notification.innerText = message;
        this.notifications.push(notification);
        this.element.appendChild(notification);
        var height = notification.clientHeight;
        notification.style.height = '0px';
        notification.style.padding = '10px';
        var self = this;

        // This is ugly but this is the process:
        // 1. Create 0 height element (above)
        // 2. Animate height
        // 3. Set a timeout for when the notification should disappear
        // 4. Animate height back to 0
        // 5. Animate padding to 0
        // 6. Remove element
        Animate.animate(notification, 'height', height + 'px', ANIMATION_DURATION).then(function() {
            setTimeout(function() {
                Animate.animate(notification, 'height', '0px', ANIMATION_DURATION).then(function() {
                    Animate.animate(notification, 'padding', '0px', ANIMATION_DURATION).then(function() {
                        var idx = self.notifications.indexOf(notification);
                        self.notifications.splice(idx, 1);
                        self.element.removeChild(notification);
                    })
                });
            }, TIMEOUT);
        });
    }
}


exports.NotificationManager = NotificationManager;
