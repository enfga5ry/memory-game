let nameAsking = document.querySelector(".control-btns span");
let nameTitle = document.querySelector(".name span");
let startBtn = document.querySelector(".control-btns");
let minutes = document.querySelector(".minutes");
let seconds = document.querySelector(".seconds");

let leaderboardTable = document.querySelector(".leaderboard");
let arrayOfUsers = [];
if (localStorage.getItem("users")) {
  arrayOfUsers = JSON.parse(localStorage.getItem("users"));
}

getDataFromLocal();

let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];
let triesElement = document.querySelector(".tries span");

let grapper = true;

nameAsking.onclick = function () {
  let yourName = prompt("What's Your Name ?");

  if (yourName == null || yourName == "") {
    nameTitle.innerHTML = "Unknown";
  } else {
    nameTitle.innerHTML = yourName;
  }
  startBtn.remove();
  document.querySelector("#starting-game").play();

  let counter = setInterval(() => {
    if (seconds.innerHTML == 0) {
      minutes.innerHTML--;
      seconds.innerHTML = 60;
    }
    seconds.innerHTML--;
    if (minutes.innerHTML == 0 && seconds.innerHTML == 0) {
      addDataToArray(nameTitle.innerHTML, triesElement.innerHTML, minutes, seconds);
      clearInterval(counter);
      location.reload();
    }
    if(grapper == false) {
      clearInterval(counter);
    }
  }, 1000);
};

shuffle(orderRange);

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  block.addEventListener("click", () => {
    flipBlock(block);

    let allMatched = blocks.filter((matched) => matched.classList.contains("has-match"));
    if(allMatched.length === 20) {
      addDataToArray(nameTitle.innerHTML, triesElement.innerHTML, minutes, seconds);
      grapper = false;

      document.querySelector("#starting-game").remove();
      document.querySelector("#winning").play();

    }
  });
});

blocks;

function shuffle(array) {
  let current = array.length;
  let temporary, random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    temporary = array[current];
    array[current] = array[random];
    array[random] = temporary;
  }
  return array;
}

function flipBlock(selectedBlock) {
  selectedBlock.classList.add("flipped");

  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("flipped")
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();

    checkMatchedBlock(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

function stopClicking() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

function checkMatchedBlock(firstBlock, secondBlock) {
  if (firstBlock.dataset.tech === secondBlock.dataset.tech) {
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
    }, duration);

    document.getElementById("fail").play();
  }
}

function addDataToArray(userName, attempt, min, sec) {
  const user = {
    name: userName,
    wrongTries: attempt,
    timeLeft: `${min.innerHTML} : ${sec.innerHTML}`,
    id: Date.now(),
  };
  arrayOfUsers.push(user);
  addScores(arrayOfUsers);
  addDataToLocal(arrayOfUsers);
}

function addScores(arrayOfUsers) {
  leaderboardTable.innerHTML = "";
  arrayOfUsers.forEach((user) => {
    let div = document.createElement("div");
    div.className = "user";
    div.setAttribute("data-id", user.id);

    let firstSpan = document.createElement("span");
    let secondSpan = document.createElement("span");
    let thirdSpan = document.createElement("span");
    
    firstSpan.innerHTML = `${user.name}`;
    div.appendChild(firstSpan);

    secondSpan.innerHTML = `Time Left: ${user.timeLeft}`;
    div.appendChild(secondSpan);
    
    thirdSpan.innerHTML = `Wrong Tries: ${user.wrongTries}`;
    div.appendChild(thirdSpan);

    leaderboardTable.appendChild(div);
  });
}

function addDataToLocal(arrayOfUsers) {
  window.localStorage.setItem("users", JSON.stringify(arrayOfUsers));
}
function getDataFromLocal() {
  let user1 = window.localStorage.getItem("users");
  if (user1) {
    let tasks = JSON.parse(user1);
    addScores(tasks);
  }
}
// window.localStorage.clear();
