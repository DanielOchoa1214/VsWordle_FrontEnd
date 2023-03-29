let register = (function (api) {  
    let _publicFunctions = {};

    let _nickname = "";

    let _joinGame = () => {
        player.setNickname($("#nickname").val());
        _nickname = player.getNickname();
        api.joinGame(_nickname).then((res)=>{
            if(res) {
                stompClient.send(`/topic/joinGame`, {}, JSON.stringify({nickname: _nickname}));
                $("#game-screen").removeClass("not-in-screen");
                $("#register-screen").addClass("not-in-screen");
            } else {
                alert("Fuera!!!! Eres el que sobra :(")
            }
        });
    };

    _publicFunctions.init = function () {  
        $("#set-nickname").click(() => {
            _joinGame();
            player.init();
        });
        // Luego mover lo siguiente al menu principal
        let playAttempt = setInterval(() => {
                $("#background-music")[0].play().then(() => {
                    clearInterval(playAttempt);
                })
                .catch(() => {
                    console.log("Esperando a que el usuario interactue con la pagina para iniciar la musica...");
                });
            }, 3000);
        // $("#background-music")[0].volume = 0.025;
        $("#background-music")[0].volume = 0;
        $("#back-to-menu").on("click", () => {
            $("#register-screen").removeClass("not-in-screen");
            $("#end-game-screen").addClass("not-in-screen");
        });
    };

    return _publicFunctions;
})(registerClient);