const noOfFloorsInput = document.querySelector(".no-of-floors");
const noOfLiftsInput = document.querySelector(".no-of-lifts");
const generateSimulation = document.querySelector(".btn-submit");
const liftSimulation = document.querySelector(".lift-simultion");

let noOfFloors = 0;
let noOfLifts = 0;

const generateFloors = (noOfFloors) => {
  let floors = "";

  for (let i = noOfFloors; i >= 1; i--) {
    if (i === noOfFloors) {
      floors += `
        <div class="floor">
            <div class="floor-controller">
                <button class="btn">DOWN</button>
            </div>
            <div class="floor-name">
                <p>Floor ${i}</p>
            </div>
        </div>
      `;
      continue;
    }

    if (i === 1) {
      floors += `
        <div class="floor">
            <div class="floor-controller">
                <button class="btn">UP</button>
            </div>
            <div class="floor-name">
                <p>Floor ${i}</p>
            </div>
        </div>
      `;
      continue;
    }

    floors += `
        <div class="floor">
            <div class="floor-controller">
                <button class="btn">UP</button>
                <button class="btn">DOWN</button>
            </div>
            <div class="floor-name">
                <p>Floor ${i}</p>
            </div>
        </div>
      `;
  }

  return floors;
};

const generateLifts = (noOfLifts) => {
  const liftEles = document.createElement("div");
  liftEles.classList.add("lifts");

  for (let i = 0; i < noOfLifts; i++) {
    const lift = document.createElement("div");
    lift.classList.add("lift");
    lift.setAttribute("data-floor", 0);
    lift.setAttribute("data-tag", i + 1);
    lift.style.left = 15 * (i + 1) + `%`;
    liftEles.appendChild(lift);
  }

  return liftEles;
};

const generateSimulationHandler = (e) => {
  e.preventDefault();
  if (!noOfFloors && !noOfLifts) {
    alert("please add Number of lifts and floors");
    return;
  }

  if (!noOfFloors) {
    alert("Please add Number of floors");
    return;
  }

  if (!noOfLifts) {
    alert("Please add Number of lifts");
    return;
  }

  liftSimulation.innerHTML = generateFloors(noOfFloors);

  const liftEles = generateLifts(noOfLifts);

  liftSimulation.appendChild(liftEles);
};

const inputChangeHandler = (e, type) => {
  if (type === "floorChange") {
    noOfFloors = +e.target.value;
  } else if (type === "liftChange") {
    noOfLifts = +e.target.value;
  }
};

noOfFloorsInput.addEventListener("input", (event) =>
  inputChangeHandler(event, "floorChange")
);
noOfLiftsInput.addEventListener("input", (event) =>
  inputChangeHandler(event, "liftChange")
);

generateSimulation.addEventListener("click", generateSimulationHandler);
