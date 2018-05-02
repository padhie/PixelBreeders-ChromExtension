'use strict';

var emoteList = {};
window.onload = function () {
    var chat = (document.getElementsByClassName('chat-list__lines')[0]).getElementsByClassName('simplebar-content')[0];

    chat.addEventListener('DOMNodeInserted', function (element) {
        changeChatEvent(element);
    });

    setInterval(function () {
        loadPixel(1);
    }, 1000 * 60 * 10);
}
