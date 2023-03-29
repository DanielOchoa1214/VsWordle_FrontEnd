let registerClient = (function () {  

    let _publicFunctions = {};
    let _server = enviroment.local;

    let _showError = (err) => {
        $("#error-text").text(err.responseText)
    }

    let _removeError = () => {
        $("#error-text").text("")
    };

    _publicFunctions.joinGame = function (nickname) {
        return $.ajax({
            url: `${_server}/lobbies`,
            type: 'POST',
            data: JSON.stringify({
                nickname: nickname,
            }),
            contentType: "application/json",
            success: res => _removeError(res),
            error: err => _showError(err),
        });
    };

    return _publicFunctions;
})();