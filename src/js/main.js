const noOfFloorsInput = document.querySelector(".no-of-floors");
const noOfLiftsInput = document.querySelector(".no-of-lifts");
const generateSimulation = document.querySelector(".btn-submit");
const liftSimulation = document.querySelector(".lift-simultion");
let floorLiftControllers = null;
let allLifts = [];
const allLiftState = [];

let noOfFloors = 0;
let noOfLifts = 0;

const generateFloors = (noOfFloors) => {
  let floors = "";

  for (let i = noOfFloors; i >= 1; i--) {
    floors += `
        <div class="floor" data-floor=${i}>
            <div class="floor-controller">
                <button class="btn" data-up=${i}>UP</button>
                <button class="btn" data-down=${i}>DOWN</button>
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
    lift.setAttribute("data-currentFloor", 1);
    lift.setAttribute("data-liftNo", i + 1);
    lift.style.left = 15 * (i + 1) + `%`;
    liftEles.appendChild(lift);
    const liftState = {
      LiftNo: i + 1,
      isMoving: false,
    };
    allLiftState.push(liftState);
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

  floorLiftControllers = document.querySelectorAll(".btn");
  allLifts = document.querySelectorAll(".lift");

  if (floorLiftControllers) {
    for (let btn of floorLiftControllers) {
      btn.addEventListener("click", moveLiftHandler);
    }
  }
};

const inputChangeHandler = (e, type) => {
  if (type === "floorChange") {
    noOfFloors = +e.target.value;
  } else if (type === "liftChange") {
    noOfLifts = +e.target.value;
  }
};

const moveLiftHandler = (e) => {
  const up = e.target.dataset.up;
  const down = e.target.dataset.down;
  const liftIndex = getFreeLiftIndex();
  const currentLift = allLifts[liftIndex];

  if (currentLift) {
    allLiftState[liftIndex].isMoving = true;
    currentLift.style.bottom = ((up ?? down) - 1) * 96 + "px";
    setTimeout(() => {
      allLiftState[liftIndex].isMoving = false;
      currentLift.dataset.currentfloor = up ?? down;
    }, 5000);
  }
};

const getFreeLiftIndex = () => allLiftState.findIndex((lift) => !lift.isMoving);

noOfFloorsInput.addEventListener("input", (event) =>
  inputChangeHandler(event, "floorChange")
);
noOfLiftsInput.addEventListener("input", (event) =>
  inputChangeHandler(event, "liftChange")
);

generateSimulation.addEventListener("click", generateSimulationHandler);
