const game = document.querySelector<HTMLElement>(".game");

console.log(game);

const gridSize = 3;

function createHoles(gridSize: number, gameElement: HTMLElement | null) {
  if (!gameElement) return;
  let holesParent: HTMLDivElement = document.createElement("div");
  holesParent.classList.add("holes__parent");
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let hole: HTMLDivElement = document.createElement("div");
      hole.classList.add("hole");
      holesParent.appendChild(hole);
    }
  }
  gameElement.appendChild(holesParent);
}

createHoles(gridSize, game);
