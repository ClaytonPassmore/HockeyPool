function request(url, data, timeout) {
    data = data || null;
    timeout = timeout || 30000;
    return new Promise(function(resolve, reject) {
        setTimeout(30000, reject);
        var request_callback = function(e) {
            if (e.target.readyState == 4 && e.target.status == 200) {
                resolve(e.target.responseText);
            }
            else {
                reject(e);
            }
        };
        var xml = new XMLHttpRequest();
        xml.addEventListener('load', request_callback);
        xml.open(data === null ? 'get' : 'post', url, true);
        if (data === null) {
            xml.send();
        }
        else {
            xml.send(JSON.stringify(data));
        }
    });
}


exports.request = request;
