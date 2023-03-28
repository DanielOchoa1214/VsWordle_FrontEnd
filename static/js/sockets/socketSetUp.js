let socketSetUp = (function () {  

    let _server = enviroment.local;

    let _joinGame = (eventbody) => {
        let playerBody = JSON.parse(eventbody.body);
        player.join(playerBody);
    };

    let _requestWords = (winner) => {
        $("#word-input").val("");
        player.endRound();
        playerclient.getPlayers().then((res) => {
            res.forEach(e => player.renderWord(e.nickname, winner));
        });
        player.roundWonLost(player.getNickname() === winner);
    };

    let _checkLetter = (event) => {
        player.renderLetter(event);
    };

    let socket = new SockJS(`${_server}/stompendpoint`);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        stompClient.subscribe(`/topic/joinGame`, eventbody => {
            _joinGame(eventbody);
        });

        stompClient.subscribe("/topic/requestNext", eventbody => {
            let winner = JSON.parse(eventbody.body).nickname;
            _requestWords(winner);
            $("#word-input").removeClass("not-in-screen")
            $("#word-input").focus();
        });

        stompClient.subscribe("/topic/sendLetter", eventbody => {
            let event = JSON.parse(eventbody.body);
            _checkLetter(event);
        });
    });
})();