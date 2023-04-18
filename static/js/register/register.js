let register = (function (api) {  
    let _publicFunctions = {};

    let _nickname = "";
    let _lobbyId = "";

    let _joinGame = () => {
        _nickname = player.getNickname();
        _lobbyId = player.getLobbyId();
        if(_lobbyId !== ""){
            api.joinGame(_nickname, _lobbyId).then((res)=>{
                if(res) {
                    socketSetUp.connect(() => {
                        socketSetUp.getStompClient().send(`/topic/joinGame.${_lobbyId}`, {}, JSON.stringify({nickname: _nickname}));
                        $("#game-screen").removeClass("not-in-screen");
                        $("#register-screen").addClass("not-in-screen");
                    }, _lobbyId);
                }
            });
        }
    };

    let _createAndJoinLobby = () => {
        _nickname = player.getNickname();
        api.createLobby(_nickname).then((res) => {
            _lobbyId = res;
            player.setLobbyId(res);
            socketSetUp.connect(() => {
                socketSetUp.getStompClient().send(`/topic/joinGame.${_lobbyId}`, {}, JSON.stringify({nickname: _nickname}));
                $("#game-screen").removeClass("not-in-screen");
                $("#register-screen").addClass("not-in-screen");
            }, _lobbyId);
        });
    };

    _publicFunctions.init = function () { 
        $("#create-lobby").off().on("click", () => {
            player.setNickname($("#nickname").val());
            _createAndJoinLobby();
            player.init();
        });
    };

    _publicFunctions.joinGame = function (nickname, lobbyId) {  
        $("#join-lobby-section").removeClass("not-in-screen");
        player.setNickname(nickname);
        player.setLobbyId(lobbyId);
        _joinGame();
        player.init();
    };

    _publicFunctions.startGame = function () {
        api.startGame();
    };

    return _publicFunctions;
})(registerClient);