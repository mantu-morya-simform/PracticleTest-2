const game = document.querySelector<HTMLElement>(".game");

import moleImgUrl from "./assets/mole.png";
import bombImageUrl from "./assets/bomb.png";

const gridSize = 3;
let Score = 0;
let Chance = 3;
let currentSelectedHole: string;
let timer: number;
let gameTimer: number;
let isStart: boolean = false;
let gameTime = 60;
let gameSpeed = { easy: 1200, medium: 800, hard: 200 };

type HighestScore = {
  score: number;
};

function printScore(score: number, chance: number) {
  let scoreElement: HTMLElement | null = document.querySelector(".score__card");
  let chanceElement: HTMLElement | null = document.querySelector(".chance");
  if (!scoreElement || !chanceElement) return;
  scoreElement.innerText = `Score: ${score}`;
  chanceElement.innerText = `Chance: ${chance}`;
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
  let moleElement = ` <img class="mole__imogi" id=${randomHoleId} src=${moleImgUrl} alt="" />`;
  let bombElement = ` <img class="bomb__imogi" id=${randomHoleId}-bomb src=${bombImageUrl} alt="" />`;
  let randomElement: string;

  if (Math.floor(Math.random() * 3) >= 2) {
    randomElement = moleElement;
  } else {
    randomElement = bombElement;
  }

  randomHoleElement.innerHTML = randomElement;
}

function getHighestScore(): HighestScore {
  const storedData = localStorage.getItem("score");

  if (!storedData) {
    return { score: 0 };
  }

  return JSON.parse(storedData) as HighestScore;
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

    if (targetEle.classList.contains("holes__parent")) return; //in case of click on the parent

    let selectedHole = targetEle.getAttribute("id");

    const data = {
      score: Score,
    };

    let highestScore: HighestScore = getHighestScore();

    if (!highestScore) {
      localStorage.setItem("score", JSON.stringify(data));
    } else {
      highestScore = getHighestScore();
    }

    if (!highestScore) return;

    if (Chance === 0 && gameTime <= 0) {
      clearTimeout(timer); //clear timeout After Total CHance End

      if (highestScore.score <= Score) {
        localStorage.setItem("score", JSON.stringify(data));
        alert(`Your New Highest Score is: ${Score}`);
      }
      Score = 0;
      Chance = 3;
      isStart = false;
      return;
    }

    if (Chance === 0) {
      alert("Not Enough Chance! Please Restart The Game");
      clearTimeout(timer); //clear timeout After Total CHance End
      if (highestScore.score <= Score) {
        localStorage.setItem("score", JSON.stringify(data));
        alert(`Your New Highest Score is: ${Score}`);
      }
      Score = 0;
      Chance = 3;
      isStart = false;
      return;
    }

    console.log(selectedHole, currentSelectedHole);
    if (selectedHole === currentSelectedHole) {
      printScore(++Score, Chance);
    } else {
      printScore(Score, --Chance);
    }
  });
}

function showTime() {
  let gameEndElement: HTMLElement | null = document.querySelector(".game__end");
  if (!gameEndElement) return;
  gameTimer = setInterval(() => {
    if (gameTime <= 0) {
      alert("Game Time is Over");
      clearTimeout(timer); //clear timeout After Total Game Time End
      clearTimeout(gameTimer);
      return;
    }
    gameEndElement.textContent = `Game End In: ${--gameTime} Sec`;
  }, 1000);
}

function printPrevScore() {
  let prevHighestEle: HTMLElement | null =
    document.querySelector(".prev__higest");
  if (!prevHighestEle) return;
  prevHighestEle.textContent = `Prev Highest :`;
  let data: string | null = localStorage.getItem("score");
  if (!data) return;
  let highestScore: HighestScore = getHighestScore();
  if (!highestScore) {
    prevHighestEle.textContent = `Prev Highest : 0`;
  } else {
    prevHighestEle.textContent = `Prev Highest : ${highestScore.score}`;
  }
}

function getGameSpeed() {
  if (Score <= 2) {
    return gameSpeed.easy;
  }

  if (Score <= 4) {
    return gameSpeed.medium;
  }

  return gameSpeed.hard;
}

function updateGameSpeed() {
  clearInterval(timer);

  timer = window.setInterval(() => {
    randomMoleAppear();
  }, getGameSpeed());
}

function afterStart() {
  if (isStart === true) return; // if one start not allow to click again
  showTime();
  printScore(Score, Chance);
  randomMoleAppear();
  updateGameSpeed();
  isStart = true;
}

function start() {
  let startButton: HTMLButtonElement | null =
    document.querySelector(".start__btn");
  if (!startButton) return;
  startButton.addEventListener("click", afterStart);
}

function restart() {
  let reStartButton: HTMLButtonElement | null =
    document.querySelector(".restart__btn");
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
