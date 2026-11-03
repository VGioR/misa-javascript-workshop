import { createBoard, findHole } from "./board.js";
import Game from "./game.js";

const board = document.querySelector("#board");
const hammer = document.querySelector("#hammer");
const nameInput = document.querySelector("#player-name");
const speedSelect = document.querySelector("#speed");
const startButton = document.querySelector("#start-button");

const holes = createBoard(board);
const game = new Game(holes, {
    controls: document.querySelector("#controls"),
    score: document.querySelector("#score"),
    time: document.querySelector("#time"),
    message: document.querySelector("#message"),
});

function startGame() {
    const playerName = nameInput.value.trim() || "Player";
    game.start(playerName, speedSelect.value);
}

startButton.addEventListener("click", startGame);

board.addEventListener("mousedown", (event) => {
    if (event.button !== 0) {
        return;
    }
    hammer.classList.add("swing");
    const hole = event.target.closest(".hole");
    if (hole !== null) {
        game.bop(hole);
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
        game.stop();
    } else {
        const hole = findHole(holes, event.key.toLowerCase());
        if (hole !== null) {
            game.bop(hole);
        }
    }
});