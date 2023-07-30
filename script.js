
const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(0);
        }

    }

    const tickCell = (boardRow, boardCol, player) => {
        board[boardRow][boardCol] = player;
    }

    const printBoard = () => {
        console.log(board);
    }

    const getBoardCell = (boardRow, boardCol) => {
        return board[boardRow][boardCol];
    }

    const getBoardRow = (rowToGet) => {
        return board[rowToGet];
    }

    const getBoardCol = (colToGet) => {
        let colRetrieved = [];

        for (let i = 0; i < 3; i++) {

            colRetrieved.push(board[i][colToGet]);

        }

        return colRetrieved;
    }

    const getBoardDiag = () => {
        let firstDiag = [];
        let secondDiagonal = [];

        for (let i = 0; i < 3; i++) {
            firstDiag.push(board[i][i]);
            secondDiagonal.push(board[i][2 - i]);
        }

        return { firstDiag, secondDiagonal }
    }


    const resetBoard = () => {

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(0);
            }

        }
    }

    return { tickCell, printBoard, resetBoard, getBoardCell, getBoardRow, getBoardCol, getBoardDiag };
})();

const gameController = ((playerOneName = "Player One", playerTwoName = "Player Two") => {

    const players = [
        {
            name: playerOneName,
            sign: 'X'
        },
        {
            name: playerTwoName,
            sign: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkRows = () => {

        for (let i = 0; i < 3; i++) {

            if (gameBoard.getBoardRow(i).every(field => field == 'X') || gameBoard.getBoardRow(i).every(field => field == 'O')) {
                return true;
            } else {

            }
        }
        return false;
    };

    const checkCols = () => {

        for (let i = 0; i < 3; i++) {

            if (gameBoard.getBoardCol(i).every(field => field == 'X') || gameBoard.getBoardCol(i).every(field => field == 'O')) {
                return true;
            } else {

            }
        }
        return false;
    };

    const checkDiags = () => {

        for (let i = 0; i < 3; i++) {

            if (gameBoard.getBoardDiag().firstDiag.every(field => field == 'X') || gameBoard.getBoardDiag().firstDiag.every(field => field == 'O')
                || gameBoard.getBoardDiag().secondDiagonal.every(field => field == 'X') || gameBoard.getBoardDiag().secondDiagonal.every(field => field == 'O')) {
                return true;
            } else {

            }
        }
        return false;
    };

    const checkWin = (player) => {
        if (checkRows() === true || checkCols() === true || checkDiags() === true) {
            console.log(`The winner is ${player.name}`);
            activePlayer = player;
            gameBoard.resetBoard();
        } else {

        }
    }

    const playRound = (PlayedRow, PlayedColumn) => {

        if (gameBoard.getBoardCell(PlayedRow, PlayedColumn) == 0) {

            gameBoard.tickCell(PlayedRow, PlayedColumn, getActivePlayer().sign);

            checkWin(getActivePlayer());
            switchPlayerTurn();
            printNewRound();

        } else {

            console.log('invalid position');

        }

    };

    return { playRound, checkCols, checkDiags, checkRows }

})();