let mainMenu = (function () {  
    let _publicFunctions = {};

    let _playBackgroundMusic = () => {
        let playAttempt = setInterval(() => {
            $("#background-music")[0].play().then(() => {
                clearInterval(playAttempt);
            })
            .catch(() => {
                console.log("Esperando a que el usuario interactue con la pagina para iniciar la musica...");
            });
        }, 3000);
        $("#background-music")[0].volume = 0.0;
    };

    let _setBackToMenuListener = (button, from) => {
        $(`#${button}`).on("click", () => {
            $("#main-menu-screen").removeClass("not-in-screen");
            $(`#${from}`).addClass("not-in-screen");
            $("#lobby-id").val("");
            $(".error-text").text("");
        });
    };

    let _exitGame = () => {
        let playerNickname = player.getNickname();
        socketSetUp.getStompClient().send(`/app/removePlayer.${player.getLobbyId()}`, {}, JSON.stringify({nickname: playerNickname}));
    };

    let _resetMainInput = () => {
        let _wordInput = $("#word-input");
        _wordInput.addClass("not-in-screen");
        _wordInput.val("");
        $("#joystick").addClass("not-in-screen");
        $("#start-game").addClass("not-in-screen");
    };

    let _resetMainPlayerView = () => {
        $(".word").text("ESPERANDO");
        $("#start-game").addClass("not-in-screen");
        $("#game-screen").addClass("not-in-screen");
        $(".side-player-panel .player").addClass("available");
    };

    let _exitGameWhenLeaving = () => {
        window.onbeforeunload = function () {  
            _exitGame();
        };
        $("#game-back-to-menu").on("click", () => {
            player.endGame();
            _resetMainInput();
            _resetMainPlayerView()
            _exitGame();
            socketSetUp.disconnect();
        });
    };

    let _setPlayListener = () => {
        $("#play").on("click", () => {
            $("#main-menu-screen").addClass("not-in-screen");
            $("#register-screen").removeClass("not-in-screen");
            register.init();
        });
    };

    _publicFunctions.init = function () { 
        // Load every Listener you can and need in the game interface
        _playBackgroundMusic();
        _setBackToMenuListener("ending-back-to-menu", "end-game-screen");
        _setBackToMenuListener("register-back-to-menu", "register-screen");
        _setBackToMenuListener("config-back-to-menu", "config-screen");
        _setBackToMenuListener("game-back-to-menu", "game-screen");
        _exitGameWhenLeaving();
        _setPlayListener();
        config.init();
    };

    _publicFunctions.resetMainInput = function () {  
        _resetMainInput();
    };

    return _publicFunctions;
})();