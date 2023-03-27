let register = (function (api) {  
    let _publicFunctions = {};

    let _nickname = "";

    let _joinGame = () => {
        player.setNickname($("#nickname").val());
        _nickname = player.getNickname();
        api.joinGame(_nickname).then((res)=>{
            if(res) {
                stompClient.send(`/topic/joinGame`, {}, JSON.stringify({nickname: _nickname}));
            } else {
                alert("Fuera!!!! Eres el que sobra :(")
            }
        });
    };

    _publicFunctions.init = function () {  
        $("#set-nickname").click(() => {
            _joinGame();
            $("#game-screen").removeClass("not-in-screen");
            $("#register-screen").addClass("not-in-screen");
            player.init();
        });
    };

    return _publicFunctions;
})(registerClient);