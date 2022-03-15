const gameBoard = document.querySelector(".game-board");
const input = document.querySelector("input");
const btn = document.querySelector(".submit-btn");
const answersDiv = document.querySelector(".answers");
const answerCorrect = document.querySelector(".correct");
const answerWrong = document.querySelector(".wrong");
const answerWrongSpan = document.querySelector(".wrong span");

const answers = ["", "", "", "", "", ""];
let solution = "";
let attemptNumber = 0;

const solutionReqOptions = {
  method: "GET",
  url: "https://random-words5.p.rapidapi.com/getRandom",
  params: { wordLength: "5" },
  headers: {
    "x-rapidapi-host": "random-words5.p.rapidapi.com",
    "x-rapidapi-key": "235a134858mshf090c59729af53ap1e1eabjsn6b31f2f933a7",
  },
};

axios
  .request(solutionReqOptions)
  .then((response) => {
    console.log(response.data);
    solution = response.data;
    btn.addEventListener("click", submitAnswer);
    input.addEventListener("keyup", submitAnswer);
  })
  .catch((error) => {
    console.error(error);
  });

// btn.addEventListener("change", () => {
//   const inputText = input.value;
//   if () {
//     input.classList.add("invalid-answer");
//     console.log(inputText);
//   }
// });

function submitAnswer(e) {
  if (e.code && e.code !== "Enter") return;

  const inputText = input.value;

  if (inputText === solution && attemptNumber < 5) {
    answers[attemptNumber] = inputText.toLowerCase();
    attemptNumber++;
    updateHtml();
    checkAnswers();
    answerCorrect.classList.add("noti-display");
    btn.removeEventListener("click", submitAnswer);
    input.removeEventListener("keyup", submitAnswer);
    return;
  }

  if (checkValidWord(inputText) && attemptNumber < 5) {
    answers[attemptNumber] = inputText.toLowerCase();
    attemptNumber++;
    updateHtml();
    checkAnswers();
    input.value = "";
  }

  if (
    checkValidWord(inputText) &&
    attemptNumber === 5 &&
    inputText !== solution
  ) {
    answers[attemptNumber] = inputText.toLowerCase();
    attemptNumber++;
    checkAnswers();
    answerWrong.classList.add("noti-display");
    answerWrongSpan.innerHTML = solution;
    btn.removeEventListener("click", submitAnswer);
    input.removeEventListener("keyup", submitAnswer);
    return;
  }
}

answerCorrect.addEventListener("click", () => {
  answerCorrect.classList.remove("noti-display");
});
answerWrong.addEventListener("click", () => {
  answerWrong.classList.remove("noti-display");
});

function checkValidWord(word) {
  return word.length === 5;
}

function checkAnswers() {
  const answerRows = document.querySelectorAll(".answer");

  answers.forEach((answer, rowIndex) => {
    const answerRow = answerRows[rowIndex];
    const answerSpans = answerRow.querySelectorAll("span");
    const solutionLetters = [...solution];
    const answerLetters = answer.split("");

    answerLetters.forEach((letter, index) => {
      if (solutionLetters[index] === letter) {
        answerSpans[index].classList.add("green");
        solutionLetters.splice(index, 1, "");
      }
    });

    answerLetters.forEach((letter, index) => {
      if (solutionLetters.includes(letter)) {
        answerSpans[index].classList.add("yellow");
        const indexInSolution = solutionLetters.indexOf(letter);
        solutionLetters.splice(indexInSolution, 1, "");
      }
    });
  });
}

function updateHtml() {
  const htmlContent = answers
    .map(
      (answer) =>
        `<div class='answer'>${answer
          .split("")
          .map((letter) => `<span>${letter}</span>`)
          .join("")}</div>`
    )
    .join("");
  answersDiv.innerHTML = htmlContent;
}
