function changeChatEvent(element) {
    var classname = element.srcElement.className;
    if (classname !== null && classname !== undefined) {
        if (classname === 'chat-line__message') {
            var messageObj = convertToMessageObj(element.srcElement);
            if (messageObj.emotes.length > 0) {
                setEmoteInMessage(messageObj);
            }
        }
    }
}

function convertToMessageObj(message) {
    var messageElements = message.children;
    var messageObj = {
        element: messageElements,
        time: {
            element: null,
            value: null,
        },
        badges: {
            element: null,
            items: [],
        },
        user: {
            element: null,
            value: '',
        },
        message: {
            element: null,
            value: '',
        },
        emotes: []
    };

    if (messageElements !== null && messageElements !== undefined) {
        for (var i = 0; i < messageElements.length; i++) {
            var element = messageElements[i];

            if (element.className.indexOf('chat-line__message--badges') >= 0) {
                messageObj.badges = {
                    element: element,
                    value: element.innerHTML
                };
            } else if (element.className.indexOf('chat-author__display-name') >= 0) {
                messageObj.user = {
                    element: element,
                    value: element.innerHTML.toLowerCase()
                };
            } else if (element.className.indexOf('message') >= 0) {
                messageObj.message = {
                    element: element.children[0],
                    value: (element.children[0]).innerHTML
                };
            } else if (element.className.indexOf('chat-line__timestamp') >= 0) {
                messageObj.time = {
                    element: element,
                    value: new Date()
                };
            }
        }
    }

    messageObj.emotes = emoteInMessage(messageObj);

    return messageObj;
}

function emoteInMessage(messageObj) {
    var emotes = [];
    var userEmotes = emoteList[messageObj.user.value];
    var messagePart = [];

    if (messageObj.message.value.indexOf(' ') >= 0) {
        messagePart = messageObj.message.value.split(' ');
    } else {
        messagePart = [messageObj.message.value];
    }

    if (messagePart !== null && messagePart !== undefined
        && userEmotes !== null && userEmotes !== undefined) {
        for (var i = 0; i < messagePart.length; i++) {
            for (var e = 0; e < userEmotes.length; e++) {
                if (userEmotes[e]['key'] === messagePart[i]) {
                    emotes.push(userEmotes[e]);
                }
            }
        }
    }
    return emotes;
}

function setEmoteInMessage(messageElement) {
    var rawMessage = messageElement.message.value;
    var newMessage = rawMessage;
    for (var i = 0; i < messageElement.emotes.length; i++) {
        emote = messageElement.emotes[i];

        var output = generateHtmlPixel(emote);
        newMessage = newMessage.replace(emote.key, output);
    }

    messageElement.message.element.innerHTML = newMessage;
}

function generateHtmlPixel(emoteObj) {
    return "<img "
        + "style='max-width:28px; max-height:28px;' "
        + "class='chat-line__message--emote' "
        + "src='" + emoteObj.link + ".svg?v=ce05d9864d' "
        + "alt='" + emoteObj.name + "' "
        + ">";
}

function loadPixel(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.count > 0) {
                addPixelsToList(response.pixels);

                if (response['page'] < response['pages']) {
                    loadPixel((response['page']) + 1);
                }
            }
        }
    };
    xhttp.open("GET", "https://pixel-breeders.com/pixel?limit=100&page=" + page, true);
    xhttp.setRequestHeader("Accept", "application/json");

    xhttp.send();
}

function addPixelsToList(pixelList) {

    for (var i = 0; i < pixelList.length; i++) {
        var pixelItem = pixelList[i];
        if (emoteList[pixelItem.owner.name] === null || emoteList[pixelItem.owner.name] === undefined) {
            emoteList[pixelItem.owner.name] = [];
        }

        var userObject = emoteList[pixelItem.owner.name];
        var pixelObj = {
            id: pixelItem.pixelId,
            key: '+' + pixelItem.pixelId + '+',
            owner: pixelItem.owner.name,
            name: pixelItem.name,
            link: 'https://pixel-breeders.com/pixel/' + pixelItem.pixelId
        };

        userObject.push(pixelObj);
        emoteList[pixelItem.owner.name] = userObject;
    }
}