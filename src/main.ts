const game = document.querySelector<HTMLElement>(".game");

import imgUrl from "./assets/angry.png";

const gridSize = 3;
let Score = 0;
let Chance = 3;
let currentSelectedHole: string;

function printScore(score: number, chance: number) {
  let scoreElement: HTMLElement | null = document.querySelector(".score__card");
  let chanceElement: HTMLElement | null = document.querySelector(".chance");
  if (!scoreElement || !chanceElement) return;
  scoreElement.innerText = `Score-${score}`;
  chanceElement.innerText = `Chance-${chance}`;
}

function createHoles(gridSize: number, gameElement: HTMLElement | null) {
  if (!gameElement) return;
  let holesParent: HTMLDivElement = document.createElement("div");
  holesParent.classList.add("holes__parent");
  let holeId = 1;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let hole: HTMLDivElement = document.createElement("div");
      hole.classList.add("hole");
      hole.id = `hole-${holeId++}`;
      holesParent.appendChild(hole);
    }
  }
  gameElement.appendChild(holesParent);
  let startButton: HTMLButtonElement = document.createElement("button");
  startButton.classList.add("start__btn");
  startButton.textContent = "Start Game";
  gameElement.appendChild(startButton);
  let restartButton: HTMLButtonElement = document.createElement("button");
  restartButton.classList.add("restart__btn");
  restartButton.textContent = "Restart Game";
  gameElement.appendChild(restartButton);
}

function randomMoleAppear() {
  let allHoleElement: NodeListOf<HTMLElement> | null =
    document.querySelectorAll(".hole");

  if (!allHoleElement) return;

  allHoleElement.forEach((hole: HTMLElement) => {
    if (!hole) return;
    hole.innerHTML = "";
  });

  let randomHole = Math.ceil(Math.random() * 9);
  let randomHoleId = `hole-${randomHole}`;
  currentSelectedHole = randomHoleId;
  let randomHoleElement: HTMLElement | null = document.querySelector(
    `#${randomHoleId}`,
  );
  if (!randomHoleElement) return;
  randomHoleElement.innerHTML = ` <img class="angry__imogi" id=${randomHoleId} src=${imgUrl} alt="" />`;
}

function trackClick() {
  let holesParent: HTMLDivElement | null =
    document.querySelector(".holes__parent");
  if (!holesParent) return;
  holesParent.addEventListener("click", (e: MouseEvent) => {
    let targetEle: HTMLElement;
    if (e.target instanceof HTMLElement) {
      targetEle = e.target;
    } else {
      return;
    }

    let selectedHole = targetEle.getAttribute("id");
    if (selectedHole === currentSelectedHole) {
      printScore(++Score, Chance);
    } else {
      if (Chance === 0) {
        alert("Not Enough Chance! Please Restart The Game");
        return;
      }
      printScore(Score, --Chance);
    }
  });
}

function restart() {
  let reStartButton: HTMLButtonElement | null =
    document.querySelector(".restart__btn");
  if (!reStartButton) return;
  reStartButton.addEventListener("click", () => {
    window.location.reload();
  });
}

function start() {
  let startButton: HTMLButtonElement | null =
    document.querySelector(".start__btn");
  if (!startButton) return;
  startButton.addEventListener("click", () => {
    setInterval(randomMoleAppear, 1200);
  });
}

createHoles(gridSize, game);

printScore(Score, Chance);

randomMoleAppear();

trackClick();

start();

restart();
