window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const COLS = 10;
  const ROWS = 20;
  const minHeight = 480;
  const headerHeight = 127;
  const availableHeight = Math.max(window.innerHeight - headerHeight, minHeight);
  const BLOCK_SIZE = Math.floor(availableHeight / ROWS);
  canvas.height = Math.max(BLOCK_SIZE * ROWS, minHeight);
  canvas.width = COLS * BLOCK_SIZE;

  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let score = 0;
  let level = 1;
  let linesCleared = 0;
  let currentPiece = null;
  let heldPiece = null;
  let nextPiece = null;
  let canHold = true;
  let dropCounter = 0;
  let dropInterval = 1000; // ms
  let lastTime = 0;
  let gameState = 'stopped'; // 'playing', 'stopped', 'gameover'
  let animationFrameId = null;

  // --- Utility Functions ---

  function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  function drawPreviewPiece(piece, canvasId) {
    const previewBox = document.getElementById(canvasId);
    if (!previewBox || !piece) return;
    const boxSize = 20;
    const padding = 2;
    previewBox.innerHTML = '';
    const miniCanvas = document.createElement('canvas');
    const size = (piece.shape[0].length + 2) * boxSize;
    miniCanvas.width = size;
    miniCanvas.height = size;
    const miniCtx = miniCanvas.getContext('2d');
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          miniCtx.fillStyle = piece.color;
          miniCtx.fillRect(
            (x + padding) * boxSize,
            (y + padding) * boxSize,
            boxSize - 1,
            boxSize - 1
          );
        }
      });
    });
    previewBox.appendChild(miniCanvas);
  }

  function drawPiece(piece) {
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          drawBlock(piece.x + dx, piece.y + dy, piece.color);
        }
      });
    });
  }

  function createPiece() {
    const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
    const { shape, color } = TETROMINOES[key];
    return {
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0,
      shape,
      color,
      type: key
    };
  }

  function collides(piece) {
    return piece.shape.some((row, dy) =>
      row.some((value, dx) => {
        if (value) {
          const x = piece.x + dx;
          const y = piece.y + dy;
          return (
            x < 0 ||
            x >= COLS ||
            y >= ROWS ||
            (y >= 0 && board[y][x])
          );
        }
        return false;
      })
    );
  }

  // --- Game Logic ---

  function holdPiece() {
    if (!canHold || gameState !== 'playing') return;
    if (!heldPiece) {
      heldPiece = { ...currentPiece };
      currentPiece = nextPiece || createPiece();
      nextPiece = createPiece();
    } else {
      const temp = { ...currentPiece };
      currentPiece = { ...heldPiece };
      currentPiece.x = Math.floor((COLS - currentPiece.shape[0].length) / 2);
      currentPiece.y = 0;
      heldPiece = temp;
    }
    canHold = false;
  }

  function drop() {
    currentPiece.y++;
    if (collides(currentPiece)) {
      currentPiece.y--;
      merge(currentPiece);
      if (gameState !== 'gameover') {
        currentPiece = nextPiece || createPiece();
        nextPiece = createPiece();
        canHold = true;
      }
    }
    dropCounter = 0;
  }

  function merge(piece) {
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          const y = piece.y + dy;
          const x = piece.x + dx;
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
            board[y][x] = piece.color;
          }
        }
      });
    });

    // Check for completed lines
    let linesComplete = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(value => value !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        linesComplete++;
        y++; // Recheck the same row
      }
    }

    // Update score and level
    if (linesComplete > 0) {
      const points = [0, 100, 300, 500, 800][linesComplete] * level;
      score += points;
      linesCleared += linesComplete;
      level = Math.floor(linesCleared / 10) + 1;
      dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    }

    // Check for game over
    if (piece.y === 0) {
      gameState = 'gameover';
    }
  }

  function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    level = 1;
    linesCleared = 0;
    dropInterval = 1000;
    currentPiece = createPiece();
    nextPiece = createPiece();
    heldPiece = null;
    canHold = true;
    gameState = 'playing';
    lastTime = 0;
    dropCounter = 0;
    drawBoard();
    update();
  }

  // --- UI Drawing ---

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ghost piece
    if (currentPiece && gameState === 'playing') {
      const ghostPiece = { ...currentPiece, y: currentPiece.y };
      while (!collides(ghostPiece)) {
        ghostPiece.y++;
      }
      ghostPiece.y--;
      ctx.globalAlpha = 0.2;
      drawPiece(ghostPiece);
      ctx.globalAlpha = 1;
    }

    // Draw board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x]) {
          drawBlock(x, y, board[y][x]);
        }
      }
    }

    // Update UI elements
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const linesEl = document.getElementById('lines');
    if (scoreEl) scoreEl.textContent = score;
    if (levelEl) levelEl.textContent = level;
    if (linesEl) linesEl.textContent = linesCleared;

    // Draw preview pieces
    drawPreviewPiece(nextPiece, 'nextPiece');
    drawPreviewPiece(heldPiece, 'holdPiece');

    // Update game state UI
    const gameStateEl = document.getElementById('gameState');
    if (gameStateEl) {
      gameStateEl.className = gameState !== 'playing' ? 'game-state visible' : 'game-state';
      gameStateEl.querySelector('h2').textContent =
        gameState === 'stopped' ? 'Welcome to Terminal Tower!' :
        gameState === 'gameover' ? 'Game Over!' : '';
      gameStateEl.querySelector('p').textContent =
        gameState === 'stopped' ? 'Click Play to start' :
        gameState === 'gameover' ? `Final Score: ${score}` : '';
    }
  }

  // --- Main Loop ---

  function update(time = 0) {
    if (gameState !== 'playing') {
      drawBoard();
      return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      drop();
    }

    drawBoard();
    if (currentPiece) drawPiece(currentPiece);

    animationFrameId = requestAnimationFrame(update);
  }

  // --- Controls ---

  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (gameState === 'stopped' || gameState === 'gameover') {
        resetGame();
      }
    });
  }

  const quitBtn = document.getElementById('quitBtn');
  if (quitBtn) {
    quitBtn.addEventListener('click', () => {
      if (gameState === 'playing') {
        gameState = 'stopped';
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        drawBoard();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (gameState !== 'playing') return;

    switch (event.key) {
      case 'ArrowLeft':
        currentPiece.x--;
        if (collides(currentPiece)) currentPiece.x++;
        break;
      case 'ArrowRight':
        currentPiece.x++;
        if (collides(currentPiece)) currentPiece.x--;
        break;
      case 'ArrowDown':
        drop();
        break;
      case 'ArrowUp':
        // Rotate piece with wall kicks
        const matrix = currentPiece.shape;
        const N = matrix.length;
        const rotated = Array.from({ length: N }, () => Array(N).fill(0));
        for (let y = 0; y < N; y++) {
          for (let x = 0; x < N; x++) {
            rotated[x][N - 1 - y] = matrix[y][x];
          }
        }
        const oldShape = currentPiece.shape;
        const oldX = currentPiece.x;
        const oldY = currentPiece.y;
        currentPiece.shape = rotated;
        const xOffset = Math.floor((oldShape[0].length - rotated[0].length) / 2);
        currentPiece.x += xOffset;
        const kicks = [0, -1, 1, -2, 2];
        let kicked = false;
        if (collides(currentPiece)) {
          for (const kick of kicks) {
            currentPiece.x = oldX + xOffset + kick;
            if (!collides(currentPiece)) {
              kicked = true;
              break;
            }
          }
          if (!kicked) {
            currentPiece.shape = oldShape;
            currentPiece.x = oldX;
            currentPiece.y = oldY;
          }
        }
        break;
      case ' ':
        // Hard drop
        while (!collides(currentPiece)) {
          currentPiece.y++;
        }
        currentPiece.y--;
        merge(currentPiece);
        if (gameState !== 'gameover') {
          currentPiece = nextPiece || createPiece();
          nextPiece = createPiece();
          canHold = true;
        }
        break;
      case 'c':
      case 'C':
        holdPiece();
        break;
    }
  });

  // --- Game Initialization ---

  // You must define TETROMINOES and TETROMINO_KEYS before this script runs!
  if (typeof TETROMINOES === 'undefined' || typeof TETROMINO_KEYS === 'undefined') {
    console.error('TETROMINOES and TETROMINO_KEYS must be defined!');
    return;
  }

  currentPiece = createPiece();
  nextPiece = createPiece();
  drawBoard();

  // --- Touch and Button Controls ---

  document.getElementById('leftBtn')?.addEventListener('click', () => {
    if (gameState === 'playing') {
      currentPiece.x--;
      if (collides(currentPiece)) currentPiece.x++;
      drawBoard();
    }
  });
  document.getElementById('rightBtn')?.addEventListener('click', () => {
    if (gameState === 'playing') {
      currentPiece.x++;
      if (collides(currentPiece)) currentPiece.x--;
      drawBoard();
    }
  });
  document.getElementById('downBtn')?.addEventListener('click', () => {
    if (gameState === 'playing') drop();
  });
  document.getElementById('rotateBtn')?.addEventListener('click', () => {
    if (gameState === 'playing') {
      // Rotate piece with wall kicks
      const matrix = currentPiece.shape;
      const N = matrix.length;
      const rotated = Array.from({ length: N }, () => Array(N).fill(0));
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          rotated[x][N - 1 - y] = matrix[y][x];
        }
      }
      const oldShape = currentPiece.shape;
      const oldX = currentPiece.x;
      const oldY = currentPiece.y;
      currentPiece.shape = rotated;
      const xOffset = Math.floor((oldShape[0].length - rotated[0].length) / 2);
      currentPiece.x += xOffset;
      const kicks = [0, -1, 1, -2, 2];
      let kicked = false;
      if (collides(currentPiece)) {
        for (const kick of kicks) {
          currentPiece.x = oldX + xOffset + kick;
          if (!collides(currentPiece)) {
            kicked = true;
            break;
          }
        }
        if (!kicked) {
          currentPiece.shape = oldShape;
          currentPiece.x = oldX;
          currentPiece.y = oldY;
        }
      }
      drawBoard();
    }
  });
  document.getElementById('dropBtn')?.addEventListener('click', () => {
    if (gameState === 'playing') {
      // Hard drop
      while (!collides(currentPiece)) {
        currentPiece.y++;
      }
      currentPiece.y--;
      merge(currentPiece);
      if (gameState !== 'gameover') {
        currentPiece = nextPiece || createPiece();
        nextPiece = createPiece();
        canHold = true;
      }
      drawBoard();
    }
  });
  document.getElementById('holdBtn')?.addEventListener('click', () => {
    if (gameState === 'playing') holdPiece();
  });
});
