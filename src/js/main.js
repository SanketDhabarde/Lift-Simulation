const noOfFloorsInput = document.querySelector(".no-of-floors");
const noOfLiftsInput = document.querySelector(".no-of-lifts");
const generateSimulation = document.querySelector(".btn-submit");
const liftSimulation = document.querySelector(".lift-simultion");
let floorLiftControllers = null;
let allLifts = [];
const allLiftState = [];

const DOOR_STATE = {
  closing: -1,
  none: 0,
  opening: 1,
};

let noOfFloors = 0;
let noOfLifts = 0;

const generateFloors = (noOfFloors) => {
  let floors = "";

  for (let i = noOfFloors; i >= 1; i--) {
    floors += `
        <div class="floor" data-floor=${i}>
            <div class="floor-controller">
                <button class="btn" data-up=${i}>🔼</button>
                <button class="btn" data-down=${i}>🔽</button>
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
    lift.innerHTML = `
    <div class="left-door"></div>
    <div class="right-door"></div>
    `;
    lift.style.left = 15 * (i + 1) + `%`;
    liftEles.appendChild(lift);
    const liftState = {
      LiftNo: i + 1,
      isMoving: false,
      doorState: DOOR_STATE.none,
    };
    allLiftState.push(liftState);
  }

  return liftEles;
};

const validateInput = () => {
  let isValidInput = true;

  if (!noOfFloors && !noOfLifts) {
    alert("please add Number of lifts and floors");
    isValidInput = false;
    return isValidInput;
  }

  if (!noOfFloors) {
    alert("Please add Number of floors");
    isValidInput = false;
    return isValidInput;
  }

  if (!noOfLifts) {
    alert("Please add Number of lifts");
    isValidInput = false;
    return isValidInput;
  }

  if (noOfLifts > 5) {
    alert("Our limitation is atmost 5 lifts. Sorry");
    isValidInput = false;
    return isValidInput;
  }

  return isValidInput;
};

const generateSimulationHandler = (e) => {
  e.preventDefault();
  if(!validateInput()) return;

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
  const liftDurationPerFloor =
    Math.abs(currentLift.dataset.currentfloor - (up ?? down)) * 2; // 2 sec per floor

  if (currentLift) {
    allLiftState[liftIndex].isMoving = true;
    currentLift.style.transitionDuration = liftDurationPerFloor + "s";
    currentLift.style.transitionTimingFunction = "linear";
    currentLift.style.bottom = ((up ?? down) - 1) * 97 + "px";

    setTimeout(() => {
      allLiftState[liftIndex].isMoving = false;
      doorOpenHandler(currentLift, liftIndex).then(({ lift, liftIndex }) =>
        doorCloseHandler(lift, liftIndex)
      );
      currentLift.dataset.currentfloor = up ?? down;
    }, liftDurationPerFloor * 1000);
  }
};

const doorCloseHandler = (lift, liftIndex) => {
  allLiftState[liftIndex].doorState = DOOR_STATE.closing;
  doorSimulation(lift.children, DOOR_STATE.closing);

  setTimeout(() => {
    allLiftState[liftIndex].doorState = DOOR_STATE.none;
  }, 2500);
};

const doorOpenHandler = (lift, liftIndex) => {
  return new Promise((resolve, reject) => {
    allLiftState[liftIndex].doorState = DOOR_STATE.opening;
    doorSimulation(lift.children, DOOR_STATE.opening);

    setTimeout(() => {
      resolve({ lift, liftIndex });
    }, 2500);
  });
};

const doorSimulation = (doors, state) => {
  const [leftDoor, rightDoor] = doors;
  switch (state) {
    case DOOR_STATE.opening:
      {
        leftDoor.style.transform = `translateX(-100%)`;
        rightDoor.style.transform = `translateX(100%)`;
      }
      break;
    case DOOR_STATE.closing:
      {
        leftDoor.style.transform = `translateX(0%)`;
        rightDoor.style.transform = `translateX(0%)`;
      }
      break;
    default:
  }
};

const getFreeLiftIndex = () =>
  allLiftState.findIndex(
    (lift) => !lift.isMoving && lift.doorState === DOOR_STATE.none
  );

noOfFloorsInput.addEventListener("input", (event) =>
  inputChangeHandler(event, "floorChange")
);
noOfLiftsInput.addEventListener("input", (event) =>
  inputChangeHandler(event, "liftChange")
);

generateSimulation.addEventListener("click", generateSimulationHandler);
