document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const restartButton = document.getElementById('restart');
    const messageElement = document.getElementById('message');
    const cells = document.querySelectorAll('.cell');
    const difficultySelect = document.getElementById('difficulty');
    const gameModeSelect = document.getElementById('game-mode');
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = document.getElementById('mode-icon');

    let currentPlayer = 'X';
    let board = Array(9).fill(null);
    let gameMode = 'ai';
    let difficulty = 'easy';
    let gameActive = true;

    function checkWin() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                cells[a].style.backgroundColor = 'lightgreen';
                cells[b].style.backgroundColor = 'lightgreen';
                cells[c].style.backgroundColor = 'lightgreen';
                messageElement.textContent = `Jogador ${currentPlayer} ganhou!`;
                gameActive = false;
                return;
            }
        }
        if (!board.includes(null)) {
            messageElement.textContent = 'Empate!';
            gameActive = false;
        }
    }

    function handleClick(event) {
        if (!gameActive) return;
        const index = event.target.dataset.index;
        if (board[index] || (gameMode === 'ai' && currentPlayer === 'O')) return;

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
            setTimeout(() => aiMove(difficulty), 500);
        }
    }

    function aiMove(difficulty) {
        let index;
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

        if (difficulty === 'easy') {
            index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else if (difficulty === 'medium') {
            index = mediumAI(emptyIndices);
        } else if (difficulty === 'hard') {
            index = hardAI(emptyIndices);
        }

        board[index] = 'O';
        cells[index].textContent = 'O';
        checkWin();
        currentPlayer = 'X';
    }

    function mediumAI(emptyIndices) {
        const winningMove = findWinningMove('O');
        if (winningMove !== null) return winningMove;

        const blockingMove = findWinningMove('X');
        if (blockingMove !== null) return blockingMove;

        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    function hardAI(emptyIndices) {
        return minimax('O').index;
    }

    function findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = player;
                const isWinning = checkIfWin(player);
                board[i] = null;
                if (isWinning) return i;
            }
        }
        return null;
    }

    function checkIfWin(player) {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] === player && board[a] === board[b] && board[a] === board[c];
        });
    }

    function minimax(player) {
        const opponent = player === 'O' ? 'X' : 'O';
        let bestScore = player === 'O' ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = player;
                const score = minimaxScore(opponent);
                board[i] = null;

                if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return { index: bestMove, score: bestScore };
    }

    function minimaxScore(player) {
        if (checkIfWin('O')) return 1;
        if (checkIfWin('X')) return -1;
        if (board.every(cell => cell !== null)) return 0;

        const opponent = player === 'O' ? 'X' : 'O';
        let bestScore = player === 'O' ? -Infinity : Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = player;
                const score = minimaxScore(opponent);
                board[i] = null;

                if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
                    bestScore = score;
                }
            }
        }
        return bestScore;
    }

    function resetGame() {
        board = Array(9).fill(null);
        cells.forEach(cell => cell.textContent = '');
        cells.forEach(cell => cell.style.backgroundColor = '#fff');
        messageElement.textContent = '';
        currentPlayer = 'X';
        gameActive = true;
    }

    function startGame() {
        gameMode = gameModeSelect.value;
        difficulty = difficultySelect.value;
        welcomeScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
    }

    startButton.addEventListener('click', startGame);

    restartButton.addEventListener('click', resetGame);

    cells.forEach(cell => cell.addEventListener('click', handleClick));

    modeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
    
        modeIcon.src = isDarkMode ? 'img/sol.png' : 'img/lua.png';
    });
    
    function updateModeIcon() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        modeIcon.src = isDarkMode ? 'img/sol.png' : 'img/lua.png';
    }
    
    updateModeIcon();
    
    
});
