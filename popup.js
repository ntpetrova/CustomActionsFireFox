'use strict';

(function () {

    function sendCommand(command) {

        browser.runtime.sendMessage({ command: command });
        window.close();
    }

    function click(e) {
        var actId = e.target.getAttribute("data-actid");
        if (actId)
            sendCommand(actId);
    }

    function onReady() {

        document.getElementById("preferences").addEventListener('click', function () {
            browser.tabs.create({ url: 'options.html' });
        });

        document.getElementById("addThisSite").addEventListener('click', function () {
            browser.tabs.query({ active: true, currentWindow: true }, function (currentTabs) {
                browser.tabs.create({ url: 'options.html?url=' + encodeURIComponent(currentTabs[0].url) });
            });
        });

        browser.storage.local.get('actions',
            function (items) {
                if (!items || !items.actions)
                    return;

                browser.tabs.query({ active: true, currentWindow: true },
                    function (currentTabs) {

                        var url = '';
                        if (currentTabs && currentTabs.length > 0)
                            url = currentTabs[0].url;

                        var found = false;

                        items.actions.forEach(function (item) {
                            if (item.execute == 'Popup menu') {
                                var regEx = new RegExp(item.url, 'i');
                                if (regEx.test(url)) {
                                    var el = document.createElement("div");
                                    el.innerText = item.name;
                                    el.setAttribute('data-actid', item.id);
                                    document.getElementById("actions").appendChild(el);
                                    el.addEventListener('click', click);
                                    found = true;
                                }
                            }
                        });

                        if (!found)
                            document.getElementById('prefHr').style.display = 'none';

                        document.getElementById('addThisSite').style.display = (/^https?:\/\//.test(url) ? 'block' : 'none');
                    });
            });
    }

    document.addEventListener('DOMContentLoaded', onReady);

})();
