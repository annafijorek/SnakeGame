// Pobieranie canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Ustawienia gry
const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = generateFood();
let blueFood = null;
let score = 0;
let redWall = null;

// Obsługa sterowania
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Główna pętla gry
function gameLoop() {
    moveSnake();
    checkCollisions();
    drawGame();
    setTimeout(gameLoop, 200); // Odświeżanie co 200 ms
}

gameLoop();

// Rysowanie gry
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Rysowanie czerwonej ściany
    if (redWall) {
        ctx.fillStyle = "red";
        if (redWall === "TOP") ctx.fillRect(0, 0, canvasSize, gridSize);
        if (redWall === "BOTTOM") ctx.fillRect(0, canvasSize - gridSize, canvasSize, gridSize);
        if (redWall === "LEFT") ctx.fillRect(0, 0, gridSize, canvasSize);
        if (redWall === "RIGHT") ctx.fillRect(canvasSize - gridSize, 0, gridSize, canvasSize);
    }

    // Rysowanie węża
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    // Rysowanie zielonego jedzenia
    ctx.fillStyle = "lime";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Rysowanie niebieskiego jedzenia
    if (blueFood) {
        ctx.fillStyle = "blue";
        ctx.fillRect(blueFood.x, blueFood.y, gridSize, gridSize);
    }

    // Wyświetlanie punktów
    updateScore();
}

// Ruch węża
function moveSnake() {
    let head = { ...snake[0] };
    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    // Odbijanie się od ścian
    if (head.x < 0) head.x = 0, direction = "RIGHT";
    if (head.x >= canvasSize) head.x = canvasSize - gridSize, direction = "LEFT";
    if (head.y < 0) head.y = 0, direction = "DOWN";
    if (head.y >= canvasSize) head.y = canvasSize - gridSize, direction = "UP";

    // Dodanie nowej głowy węża
    snake.unshift(head);

    // Sprawdzanie kolizji z jedzeniem
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood(); // Generowanie nowego jedzenia
    } else if (blueFood && head.x === blueFood.x && head.y === blueFood.y) {
        score = Math.max(0, score - 1);
        if (snake.length > 1) snake.pop(); // Utrata segmentu
        blueFood = null; // Usunięcie niebieskiego jedzenia
    } else {
        snake.pop(); // Usuwanie ostatniego segmentu węża
    }
}

// Sprawdzanie kolizji
function checkCollisions() {
    if ((redWall && (redWall === "TOP" && snake[0].y === 0)) ||
        (redWall && (redWall === "BOTTOM" && snake[0].y === canvasSize - gridSize)) ||
        (redWall && (redWall === "LEFT" && snake[0].x === 0)) ||
        (redWall && (redWall === "RIGHT" && snake[0].x === canvasSize - gridSize))) {
        alert("Game Over!");
        location.reload();
    }
}

// Aktualizacja wyniku
function updateScore() {
    scoreElement.textContent = `Wynik: ${score}`;
}

// Generowanie czerwonej ściany
function generateRedWall() {
    const walls = ["TOP", "BOTTOM", "LEFT", "RIGHT"];
    redWall = walls[Math.floor(Math.random() * walls.length)];
    setTimeout(() => { redWall = null; }, 10000);
    setTimeout(generateRedWall, Math.random() * 13000 + 1000);
}

// Generowanie jedzenia
function generateFood() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
        };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
}

// Generowanie niebieskiego jedzenia
function generateBlueFood() {
    setTimeout(() => {
        blueFood = generateFood();
        setTimeout(() => { blueFood = null; }, 10000); // Niebieskie jedzenie znika po 10 sekundach
        generateBlueFood(); // Powtarzanie procesu
    }, Math.random() * 5000 + 13000); // Losowy interwał od 13 do 18 sekund
}

// Uruchomienie generowania ściany i jedzenia
generateRedWall();
generateBlueFood();
