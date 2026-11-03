import { createBoard, randomHole, findHole, showBot, hideBot } from "./board.js";
import rankFor from "./rank.js";

const POP_DELAYS = { slow: 1100, normal: 850, fast: 600};
const ROUND_SECONDS = 30;

const controls = document.querySelector("#controls");
const nameInput = document.querySelector("#player-name");
const speedSelect = document.querySelector("#speed");
const startButton = document.querySelector("#start-button");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");
const message = document.querySelector("#message");
const board = document.querySelector("#board");
const hammer = document.querySelector("#hammer");

const holes = createBoard(board);

let playerName = "Player";
let score = 0;
let misses = 0;
let timeLeft = ROUND_SECONDS;
let currentHole = null;
let isPlaying = false;
let popTimer = null;
let clockTimer = null;

function updateStats() {
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
}

function popUp() {
    if (currentHole !== null) {
        hideBot(currentHole);
    }
    currentHole = randomHole(holes, currentHole);
    showBot(currentHole);
}

function startGame() {
    if (isPlaying) {
        return;
    }
    playerName = nameInput.value.trim() || "Player";
    score = 0;
    misses = 0;
    timeLeft = ROUND_SECONDS;
    isPlaying = true; 
    controls.disabled = true;
    message.textContent = `Go. ${playerName}!`;
    updateStats();
    
    popUp();
    popTimer = setInterval(popUp, POP_DELAYS[speedSelect.value]);
    clockTimer = setInterval(tick, 1000);
}

function tick() {
    timeLeft -= 1;
    updateStats();
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    if (!isPlaying) {
        return;
    }
    isPlaying = false;
    clearInterval(popTimer);
    clearInterval(clockTimer);
    if (currentHole !== null) {
        hideBot(currentHole);
        currentHole = null;
    }
    controls.disabled = false;
    message.textContent = `${playerName}, you bopped ${score} bots and missed ${misses}. ${rankFor(score)}!`;
}

function bop(hole) {
    if (!isPlaying) {
        return;
    }
    if (hole === currentHole) {
        score += 1;
        hideBot(hole);
        currentHole = null;
        hole.classList.add("bopped");
        setTimeout(() => hole.classList.remove("bopped"), 250);
    } else {
        misses += 1;
    }
    updateStats();
}

board.addEventListener("mousedown", (event) => {
    if (event.button !== 0) {
        return;
    }
    hammer.classList.add("swing");
    const hole = event.target.closest(".hole");
    if (hole !== null) {
        bop(hole);
    }
});

document.addEventListener("mouseup", () => {
    hammer.classList.remove("swing");
});

board.addEventListener("mouseenter", () => {
    hammer.classList.add("visible");
});

board.addEventListener("mouseleave", () => {
    hammer.classList.remove("visible");
});

board.addEventListener("mousemove", (event) => {
    hammer.style.left = `${event.clientX}px`;
    hammer.style.top = `${event.clientY}px`;
});

board.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

startButton.addEventListener("click", startGame);

nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startGame();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.target === nameInput || event.target === speedSelect) {
        return;
    }
    if (event.repeat) {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        startGame();
    } else if (event.key === "Escape") {
        endGame();
    } else {
        const hole = findHole(holes, event.key.toLowerCase());
        if (hole !== null) {
            bop(hole);
        }
    }
});
