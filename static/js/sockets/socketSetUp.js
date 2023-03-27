let socketSetUp = (function () {  

    let _server = enviroment.local;

    let _joinGame = (eventbody) => {
        let playerBody = JSON.parse(eventbody.body);
        let _nickname = player.getNickname();
        if(playerBody.nickname === _nickname) {
            $(".player-1").first().attr("id", _nickname);
            $("#main-player-nick").text(_nickname);
            playerclient.missingPlayers(_nickname).then((res) => {
                res.forEach(element => {
                    player.renderPlayer(element);
                });
            });
        } else {
            player.renderPlayer(playerBody.nickname);
        }
    };

    let _requestWords = () => {
        $("#word-input").val("");
        player.endRound();
        playerclient.getPlayers().then((res) => {
            res.forEach(e => player.renderWord(e.nickname));
        });
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
            _requestWords();
            $("#word-input").removeClass("not-in-screen")
            $("#word-input").focus();
        });

        stompClient.subscribe("/topic/sendLetter", eventbody => {
            let event = JSON.parse(eventbody.body);
            _checkLetter(event);
        });
    });
})();