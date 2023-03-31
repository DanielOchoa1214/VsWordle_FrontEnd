let socketSetUp = (function () {  

    let _server = enviroment.local;
    let _stompClient = null;

    let _publicFunctions = {};

    let _joinGame = (eventbody) => {
        let playerBody = JSON.parse(eventbody.body);
        player.join(playerBody);
    };

    let _requestWords = (winner) => {
        $("#word-input").val("");
        $("#start-game").addClass("not-in-screen");
        player.endRound();
        playerclient.getPlayers().then((res) => {
            res.forEach(e => player.renderWord(e.nickname, winner));
        });
        player.roundWonLost(player.getNickname() === winner);
    };

    let _connect = (clb) => {
        let _socket = new SockJS(`${_server}/stompendpoint`);
        _stompClient = Stomp.over(_socket);
        _stompClient.connect({}, function (frame) {
            _stompClient.subscribe(`/topic/joinGame`, eventbody => {
                _joinGame(eventbody);
            });
            _stompClient.subscribe("/topic/requestNext", eventbody => {
                let winner = JSON.parse(eventbody.body).nickname;
                _requestWords(winner);
                $("#joystick").removeClass("not-in-screen");
                $("#word-input").removeClass("not-in-screen");
                $("#word-input").focus();
            });
    
            _stompClient.subscribe("/topic/sendLetter", eventbody => {
                let event = JSON.parse(eventbody.body);
                player.renderLetter(event);
            });
    
            _stompClient.subscribe("/topic/deleteLetter", eventbody => {
                let event = JSON.parse(eventbody.body);
                player.deleteLetter(event)
            });
    
            _stompClient.subscribe("/topic/endGame", eventbody => {
                let event = JSON.parse(eventbody.body);
                ending.endGame(event);
            });

            _stompClient.subscribe("/topic/removePlayer", eventbody => {
                let event = JSON.parse(eventbody.body);
                player.playerLeft(event);
            });

            // Cosas que correr cuando termine la conexion
            clb();
        });
    };

    let _disconnect = () => {
        _stompClient.disconnect();
    };

    _publicFunctions.connect = function (clb) {  
        _connect(clb);
    };

    _publicFunctions.disconnect = function () {  
        _disconnect();
    };

    _publicFunctions.getStompClient = function () {  
        return _stompClient;
    };


    return _publicFunctions;
})();