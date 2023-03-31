let registerClient = (function () {  

    let _publicFunctions = {};
    let _server = enviroment.local;

    let _showError = (err) => {
        $(".error-text").text(err.responseText);
    }

    let _success = () => {
        $(".error-text").text("");
        $("#end-game-screen").addClass("not-in-screen");
    };

    _publicFunctions.joinGame = function (nickname) {
        return $.ajax({
            url: `${_server}/lobbies`,
            type: 'POST',
            data: JSON.stringify({
                nickname: nickname,
            }),
            contentType: "application/json",
            success: res => _success(res),
            error: err => _showError(err),
        });
    };

    _publicFunctions.removePlayer = function (nickname) {  
        return $.ajax({
            url: `${_server}/lobbies`,
            type: 'DELETE',
            data: {
                nickname: nickname,
            },
            contentType: "application/json",
        });
    };

    return _publicFunctions;
})();