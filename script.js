
const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push('');
        }

    }

    const tickCell = (boardRow, boardCol, player) => {
        board[boardRow][boardCol] = player;
    }

    const printBoard = () => {
        return board;
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
                board[i].push('');
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
    let isOver = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkRows = () => {

        for (let i = 0; i < 3; i++) {

            if (gameBoard.getBoardRow(i).every(field => field == 'X') || gameBoard.getBoardRow(i).every(field => field == 'O')) {
                return i;
            } else {

            }
        }
        return false;
    };

    const checkCols = () => {

        for (let i = 0; i < 3; i++) {

            if (gameBoard.getBoardCol(i).every(field => field == 'X') || gameBoard.getBoardCol(i).every(field => field == 'O')) {
                return i;
            } else {

            }
        }
        return false;
    };

    const checkDiags = () => {

        if (gameBoard.getBoardDiag().firstDiag.every(field => field == 'X') || gameBoard.getBoardDiag().firstDiag.every(field => field == 'O')) {
            return 0;
        } else if (gameBoard.getBoardDiag().secondDiagonal.every(field => field == 'X') || gameBoard.getBoardDiag().secondDiagonal.every(field => field == 'O')) {
            return 1;
        }

        return false;
    };

    const checkBoard = () => {
        if (checkRows() !== false || checkCols() !== false || checkDiags() !== false) {
            isOver = true;
            return `The winner is ${getActivePlayer().name}`;
        } else if (gameBoard.printBoard().flat().every(field => field != '')) {
            isOver = true;
            return `It's A Draw!`;
        } else {
            switchPlayerTurn();
            return `${getActivePlayer().name}'s turn`
        }
    }

    const getIsOver = () => { return isOver }

    const setIsOver = (over) => { isOver = over }

    const playRound = (PlayedRow, PlayedColumn) => {

        if (gameBoard.getBoardCell(PlayedRow, PlayedColumn) == '') {

            gameBoard.tickCell(PlayedRow, PlayedColumn, getActivePlayer().sign);

            displayController.displayGameInfo();
            displayController.displayBoard();

        }
    };

    return { playRound, checkCols, checkDiags, checkRows, getActivePlayer, checkBoard, getIsOver, setIsOver }

})();

const displayController = (() => {
    const fields = Array.from(document.querySelectorAll('.field'));
    const gameInfoText = document.getElementById('game-info');
    const restartBtn = document.getElementById('restart-button')

    const displayBoard = () => {
        let arrayBoard = gameBoard.printBoard().flat();

        for (let i = 0; i < 9; i++) {
            fields[i].innerHTML = `${arrayBoard[i]}`
        }

        if (gameController.checkRows() !== false) {

            fields[gameController.checkRows() * 3].classList.add('winner');
            fields[(gameController.checkRows() * 3) + 1].classList.add('winner');
            fields[(gameController.checkRows() * 3) + 2].classList.add('winner');

        } else if (gameController.checkCols() !== false) {

            fields[gameController.checkCols()].classList.add('winner');
            fields[gameController.checkCols() + 3].classList.add('winner');
            fields[gameController.checkCols() + 6].classList.add('winner');

        } else if (gameController.checkDiags() === 0) {

            fields[gameController.checkDiags()].classList.add('winner');
            fields[gameController.checkDiags() + 4].classList.add('winner');
            fields[gameController.checkDiags() + 8].classList.add('winner');

        } else if (gameController.checkDiags() === 1) {

            fields[gameController.checkDiags() + 1].classList.add('winner');
            fields[gameController.checkDiags() + 3].classList.add('winner');
            fields[gameController.checkDiags() + 5].classList.add('winner');

        } else if (gameInfoText.innerHTML === `It's A Draw!`) {
            fields.forEach(field => {
                field.classList.add('draw');
            })
        }
    }

    const displayGameInfo = () => {
        gameInfoText.innerHTML = `${gameController.checkBoard()}`;
    }

    function convertIndexTo2D(index, cols) {
        const row = Math.floor(index / cols);
        const col = index % cols;
        return { row, col };
    }

    const resetDisplayBoard = () => {
        gameBoard.resetBoard();
        gameController.setIsOver(false);
        fields.forEach(field => {
            field.classList.remove('winner');
            field.classList.remove('draw');
        })
    }

    fields.forEach((field, index) => {
        field.addEventListener('click', (e) => {
            if (gameController.getIsOver() || e.target.textContent !== '') {
                return;
            } else {
                gameController.playRound(convertIndexTo2D(index, 3).row, convertIndexTo2D(index, 3).col)
            }
        })
    })

    restartBtn.onclick = () => {
        resetDisplayBoard();
        displayGameInfo();
        displayBoard();
    }

    return { displayBoard, displayGameInfo, fields }
})();