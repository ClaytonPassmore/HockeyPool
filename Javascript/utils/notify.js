const TIMEOUT = 5000;


function notify(message) {
    var notification = document.createElement('div');
    notification.setAttribute('class', 'notification-widget');
    notification.innerText = message;
    var element = document.getElementsByTagName('body')[0];
    element.appendChild(notification);

    // Slide out notification
    setTimeout(function() {
        notification.style.top = 0;
    }, 200);

    // Slide notifiation back up after TIMEOUT milliseconds
    setTimeout(function() {
        notification.style.top = '-200px';
    }, TIMEOUT);

    // Delete once the notification transitions out
    setTimeout(function() {
        element.removeChild(notification);
    }, TIMEOUT + 1000);
}


exports.notify = notify;
