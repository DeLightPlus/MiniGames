document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill('');
    let gameActive = true;

    // Create board cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (gameBoard[index] || !gameActive) return;

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWin()) {
            status.textContent = `${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            status.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `${currentPlayer}'s turn`;
    }

    function checkWin() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // Rows
            [0,3,6], [1,4,7], [2,5,8], // Columns
            [0,4,8], [2,4,6]           // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a,b,c] = pattern;
            return gameBoard[a] &&
                   gameBoard[a] === gameBoard[b] &&
                   gameBoard[a] === gameBoard[c];
        });
    }

    function checkDraw() {
        return gameBoard.every(cell => cell);
    }

    resetBtn.addEventListener('click', () => {
        gameBoard = Array(9).fill('');
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `${currentPlayer}'s turn`;
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
    });
});