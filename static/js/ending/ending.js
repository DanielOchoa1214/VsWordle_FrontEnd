let ending = (function () {

    let _resetMainPlayerView = () => {
        $(".word").text("ESPERANDO");
        $("#start-game").addClass("not-in-screen");
        $("#game-screen").addClass("not-in-screen");
        $(".side-player-panel .player").addClass("available");
    };

    let _showWinner = (results) => {
        let markUp = ""
        results.forEach((player) => {
            markUp += `
            <tr>
                <td>${player.nickname}</td>
                <td>${player.roundsWon}</td>
                <td>${player.correctLetters}</td>
                <td>${player.wrongLetters}</td>
            </tr>`;
        });
        $("#results").html(markUp);
        $("#end-game-screen").removeClass("not-in-screen");
    };

    let _playEndingSound = (results) => {
        player.runIfItsMe(results[0].nickname, () => {
            $("#happy-wheels")[0].volume = 0.5;
            $("#happy-wheels")[0].play();
        }, () => {
            $("#game-over")[0].volume = 0.5;
            $("#game-over")[0].play();
        });
    };

    let _endGame = (results) => {
        mainMenu.resetMainInput();
        player.endGame();
        _resetMainPlayerView();
        _showWinner(results);
        _playEndingSound(results);
        $("#join-lobby-section").addClass("not-in-screen");
        socketSetUp.disconnect();
    };

    let _publicFunctions = {};

    _publicFunctions.endGame = function (results) {
        _endGame(results);
    };

    _publicFunctions.resetMainInput = function () {  
        _resetMainInput();
    };

    return _publicFunctions;
})();