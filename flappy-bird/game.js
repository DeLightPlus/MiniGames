document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const gameState = document.getElementById('gameState');

    // Canvas setup
    canvas.width = 320;
    canvas.height = 480;

    // Game variables
    let score = 0;
    let highScore = localStorage.getItem('flappyHighScore') || 0;
    let frames = 0;
    let gameStarted = false;
    let gameOver = false;

    // Bird properties
    const bird = {
        x: 50,
        y: canvas.height / 2,
        width: 24,
        height: 24,
        gravity: 0.49,
        jump: 8,
        velocity: 0,
        
        draw: function() {
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.width/2, this.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0d9668';
            ctx.lineWidth = 2;
            ctx.stroke();
        },
        
        flap: function() {
            this.velocity = -this.jump;
        },
        
        update: function() {
            this.velocity += this.gravity;
            this.y += this.velocity;
            
            // Ground collision
            if (this.y + this.height/2 >= canvas.height) {
                this.y = canvas.height - this.height/2;
                if (gameStarted) gameOver = true;
            }
            // Ceiling collision
            if (this.y - this.height/2 <= 0) {
                this.y = this.height/2;
                this.velocity = 0;
            }
        }
    };

    // Pipe properties
    const pipes = {
        position: [],
        top: -150,
        bottom: 150,
        width: 50,
        height: 400,
        gap: 170,
        maxYPos: -150,
        dx: 2,
        
        draw: function() {
            for(let i = 0; i < this.position.length; i++) {
                let p = this.position[i];
                
                // Top pipe
                ctx.fillStyle = '#10b981';
                ctx.fillRect(p.x, p.y, this.width, this.height);
                
                // Bottom pipe
                ctx.fillRect(p.x, p.y + this.height + this.gap, this.width, this.height);
            }
        },
        
        update: function() {
            if (gameStarted) {
                if (frames % 100 === 0) {
                    this.position.push({
                        x: canvas.width,
                        y: this.maxYPos * (Math.random() + 1)
                    });
                }
                for(let i = 0; i < this.position.length; i++) {
                    let p = this.position[i];
                    p.x -= this.dx;
                    
                    // Collision detection
                    if (bird.x + bird.width/2 > p.x && 
                        bird.x - bird.width/2 < p.x + this.width && 
                        (bird.y - bird.height/2 < p.y + this.height || 
                         bird.y + bird.height/2 > p.y + this.height + this.gap)) {
                        gameOver = true;
                    }
                    
                    // Score point
                    if (p.x + this.width < bird.x && !p.passed) {
                        score++;
                        p.passed = true;
                        scoreElement.textContent = score;
                    }
                    
                    // Remove pipes that are off screen
                    if (p.x + this.width <= 0) {
                        this.position.shift();
                    }
                }
            }
        }
    };

    // Game functions
    function draw() {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        bird.draw();
        pipes.draw();
    }
    
    function update() {
        bird.update();
        if (gameStarted) {
            pipes.update();
            frames++;
        }
    }
    
    function loop() {
        update();
        draw();
        
        if (!gameOver) {
            requestAnimationFrame(loop);
        } else {
            gameState.querySelector('h2').textContent = 'Game Over!';
            gameState.querySelector('p').textContent = `Score: ${score}`;
            gameState.classList.add('visible');
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('flappyHighScore', highScore);
                highScoreElement.textContent = highScore;
            }
        }
    }

    // Event listeners
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            if (!gameStarted) {
                gameStarted = true;
                gameState.classList.remove('visible');
            }
            bird.flap();
        }
    });
    
    canvas.addEventListener('click', function() {
        if (!gameStarted) {
            gameStarted = true;
            gameState.classList.remove('visible');
        }
        bird.flap();
    });

    // Game initialization
    highScoreElement.textContent = highScore;
    gameState.classList.add('visible');
    loop();
});