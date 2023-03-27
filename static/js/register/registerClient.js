let registerClient = (function () {  

    let _publicFunctions = {};
    let _server = enviroment.local;

    _publicFunctions.joinGame = function (nickname) {
        return $.ajax({
            url: `${_server}/lobbies`,
            type: 'POST',
            data: JSON.stringify({
                nickname: nickname,
            }),
            contentType: "application/json"
        });
    };

    return _publicFunctions;
})();