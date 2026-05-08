const game = document.querySelector<HTMLElement>(".game");

import moleImgUrl from "./assets/mole.png";
import bombImageUrl from "./assets/bomb.png";

const gridSize = 3;
let Score = 0;
let Chance = 3;
let currentSelectedHole: string = "";
let timer: number;
let gameTimer: number;
let isStart: boolean = false;
let gameTime = 10;
let gameSpeed = { easy: 1200, medium: 800, hard: 200 };

type HighestScore = {
  score: number;
};

function printScore(score: number, chance: number) {
  let scoreElement = document.querySelector<HTMLElement>(".score__card");
  let chanceElement = document.querySelector<HTMLElement>(".chance");
  if (!scoreElement || !chanceElement) return;

  scoreElement.innerText = `Score: ${score}`;
  chanceElement.innerText = `Chance: ${chance}`;
}

function createHoles(gridSize: number, gameElement: HTMLElement | null) {
  if (!gameElement) return;

  let holesParent = document.createElement("div");
  holesParent.classList.add("holes__parent");

  let holeId = 1;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let hole = document.createElement("div");
      hole.classList.add("hole");
      hole.id = `hole-${holeId++}`;
      holesParent.appendChild(hole);
    }
  }

  gameElement.appendChild(holesParent);

  let startButton = document.createElement("button");
  startButton.classList.add("start__btn");
  startButton.textContent = "Start Game";
  gameElement.appendChild(startButton);

  let restartButton = document.createElement("button");
  restartButton.classList.add("restart__btn");
  restartButton.textContent = "Restart Game";
  gameElement.appendChild(restartButton);
}

function randomMoleAppear() {
  let allHoleElement = document.querySelectorAll<HTMLElement>(".hole");

  allHoleElement.forEach((hole) => {
    hole.innerHTML = "";
  });

  let randomHole = Math.ceil(Math.random() * 9);
  let randomHoleId = `hole-${randomHole}`;
  currentSelectedHole = randomHoleId;

  let randomHoleElement = document.querySelector<HTMLElement>(
    `#${randomHoleId}`,
  );
  if (!randomHoleElement) return;

  let moleElement = `<img class="mole__imogi" id="${randomHoleId}" src="${moleImgUrl}" />`;
  let bombElement = `<img class="bomb__imogi" id="${randomHoleId}-bomb" src="${bombImageUrl}" />`;

  let randomElement =
    Math.floor(Math.random() * 3) < 2 ? moleElement : bombElement;

  randomHoleElement.innerHTML = randomElement;
}

function getHighestScore(): HighestScore {
  const storedData = localStorage.getItem("score");
  return storedData ? JSON.parse(storedData) : { score: 0 };
}

function trackClick() {
  let holesParent = document.querySelector<HTMLDivElement>(".holes__parent");
  if (!holesParent) return;

  holesParent.addEventListener("click", (e: MouseEvent) => {
    if (!isStart) return;

    let targetEle = e.target as HTMLElement;
    if (!targetEle || targetEle.classList.contains("holes__parent")) return; //in case of click on the parent

    let selectedHole = targetEle.getAttribute("id");

    let highestScore = getHighestScore();

    //clear timeout After Total CHance End or game Time is End
    if (Chance === 0 || gameTime <= 0) {
      clearInterval(timer);
      clearInterval(gameTimer);
      isStart = false;

      if (highestScore.score <= Score) {
        localStorage.setItem("score", JSON.stringify({ score: Score }));
        alert(`Your New Highest Score is: ${Score}`);
      }
      return;
    }

    if (selectedHole?.includes(currentSelectedHole)) {
      printScore(++Score, Chance);
      updateGameSpeed();
    } else {
      printScore(Score, --Chance);
    }
  });
}

function showTime() {
  let gameEndElement = document.querySelector<HTMLElement>(".game__end");
  if (!gameEndElement) return;

  gameTimer = window.setInterval(() => {
    if (gameTime <= 0) {
      alert("Game Time is Over");
      clearInterval(timer);
      clearInterval(gameTimer);
      isStart = false;
      return;
    }
    gameEndElement.textContent = `Game End In: ${--gameTime} Sec`;
  }, 1000);
}

function printPrevScore() {
  let prevHighestEle = document.querySelector<HTMLElement>(".prev__higest");
  if (!prevHighestEle) return;

  let highestScore = getHighestScore();
  prevHighestEle.textContent = `Prev Highest : ${highestScore.score}`;
}

function getGameSpeed() {
  if (Score <= 2) return gameSpeed.easy;
  if (Score <= 4) return gameSpeed.medium;
  return gameSpeed.hard;
}

function updateGameSpeed() {
  if (timer) clearInterval(timer);

  timer = window.setInterval(() => {
    randomMoleAppear();
  }, getGameSpeed());
}

function afterStart() {
  if (isStart) return;

  Score = 0;
  Chance = 3;
  gameTime = 10;

  printScore(Score, Chance);
  showTime();
  randomMoleAppear();
  updateGameSpeed();

  isStart = true;
}

function start() {
  let startButton = document.querySelector<HTMLButtonElement>(".start__btn");
  if (!startButton) return;

  startButton.addEventListener("click", afterStart);
}

function restart() {
  let reStartButton =
    document.querySelector<HTMLButtonElement>(".restart__btn");
  if (!reStartButton) return;

  reStartButton.addEventListener("click", () => {
    window.location.reload();
  });
}

createHoles(gridSize, game);
trackClick();
start();
restart();
printPrevScore();
