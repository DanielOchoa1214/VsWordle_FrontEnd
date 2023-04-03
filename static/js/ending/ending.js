let ending = (function () {

    let _resetMainInput = () => {
        let _wordInput = $("#word-input");
        _wordInput.addClass("not-in-screen");
        _wordInput.val("");
        _wordInput.off("keydown");
        _wordInput.off("input");
        $("#joystick").addClass("not-in-screen");
    };

    let _resetMainPlayerView = () => {
        $(".word").text("ESPERANDO");
        $("#start-game").addClass("not-in-screen");
        $("#game-screen").addClass("not-in-screen");
        $(".side-player-panel .player").addClass("available");
        player.setAdmin(false);
    };

    let _showWinner = (winner) => {
        $("#winner").text(winner.nickname);
        $("#end-game-screen").removeClass("not-in-screen");
    };

    let _playEndingSound = (winner) => {
        player.runIfItsMe(winner.nickname, () => {
            $("#happy-wheels")[0].volume = 0.5;
            $("#happy-wheels")[0].play();
        }, () => {
            $("#game-over")[0].volume = 0.5;
            $("#game-over")[0].play();
        });
    };

    let _endGame = (winner) => {
        _resetMainInput();
        player.endGame();
        _resetMainPlayerView();
        _showWinner(winner);
        _playEndingSound(winner);
        $("#join-lobby-section").addClass("not-in-screen");
        socketSetUp.disconnect();
    };

    let _publicFunctions = {};

    _publicFunctions.endGame = function (winner) {
        _endGame(winner);
    }

    return _publicFunctions;
})();