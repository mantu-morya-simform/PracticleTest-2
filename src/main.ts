const game = document.querySelector<HTMLElement>(".game");

const gridSize = 3;

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
}

createHoles(gridSize, game);

function randomMoleAppear() {
  let allHoleElement: NodeListOf<Element> = document.querySelectorAll(".hole");

  allHoleElement.forEach((hole: HTMLElement) => {
    hole.innerHTML = "";
  });

  let randomHole = Math.ceil(Math.random() * 9);
  let randomHoleId = `hole-${randomHole}`;
  let randomHoleElement: HTMLElement = document.querySelector(
    `#${randomHoleId}`,
  );
  randomHoleElement.innerHTML = ` <img class="angry__imogi" src="./src/assets/angry.png" alt="" />`;
}

randomMoleAppear();

setInterval(randomMoleAppear, 500);
