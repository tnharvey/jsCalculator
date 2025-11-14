// TODO: PLEASE refactor, this is such a mess. Yes it works, but ouch!
// start with following the guidelines more closely, using simply operation calls
// and running total. Much simpler that way
// I did update the keyboard event handling to include all number keys and basic operations
// Still needs scientific notation when exceeding display limits

let operationHistory = [];
let operationString = "";
let currentNumber = null;
let total = 0;
let decimalListener = true;
let hasDecimal = false;
let zeroError = false;

function operate () {
  checkCurrentNumber();

  // set initial value for total from first entry
  if (operationHistory.length === 2) {
    total = operationHistory[0];
    updateDisplay();
  }

  else {
    //if last entry is a number
    if (!isNaN(operationHistory[operationHistory.length-1])) {
      // if at least a number, an operator, and another operator have been entered
      if (operationHistory.length >= 3) {
        // set tempArr from last two items in operationHistory
        let tempArr = operationHistory.slice(operationHistory.length-2,operationHistory.length);
        let tempOperation = tempArr.toString();

        // replace commas from string conversion and combine with total
        tempOperation = tempOperation.replace(/\,/g,"");
        tempOperation = total.toString() + tempOperation;

        // return error and lock down if dividing by zero
        if (tempOperation.slice(tempOperation.length-2,tempOperation.length) === "/0") {
          total = "nope";
          zeroError = true;
          disableAllButtons();
          document.getElementById("clearButton").classList.remove("disabled");
        }
        else {
          total = eval(tempOperation);
          // limit length of total to 12 characters
          if (total.toString().length > 12) {
            total = Number(total.toString().substr(0,11));
          }
        }
      }
    }
    else {
      if (operationHistory.length >= 3) {
        // set tempArr from last two items in operationHistory
        let tempArr = operationHistory.slice(operationHistory.length-3,operationHistory.length-1);
        let tempOperation = tempArr.toString();

        // replace commas from string conversion and combine with total
        tempOperation = tempOperation.replace(/\,/g,"");
        tempOperation = total.toString() + tempOperation;

        total = eval(tempOperation);
        // limit length of total to 12 characters
        if (total.toString().length > 12) {
          total = Number(total.toString().substr(0,11));
        }
      }
    }
    updateDisplay();
  }
}

function updateDisplay() {
  if (currentNumber === null) {
    document.getElementById("displayTotal").innerHTML = total;
  }
  else {
    document.getElementById("displayTotal").innerHTML = currentNumber;
  }
  document.getElementById("displayOps").innerHTML = operationString;

  if (decimalListener === true && hasDecimal === true) {
    document.getElementById("decimalButton").removeEventListener("click",decimalCheck);
    document.getElementById("decimalButton").classList.add("disabled");
    decimalListener = false;
  }
  else if (decimalListener === false && hasDecimal === false) {
    document.getElementById("decimalButton").addEventListener("click",decimalCheck);
    document.getElementById("decimalButton").classList.remove("disabled");
    decimalListener = true;
  }
}

function checkCurrentNumber () {
  if (currentNumber != null) {
    operationHistory.push(currentNumber);
    hasDecimal = false;
    currentNumber = null;
    operationString = fixTimes(operationHistory).toString();
    operationString = operationString.replace(/\,/g," ");
    if (operationString.length > 36) {
      operationString = operationString.substr(0,36);
    }
  }
}

function addOperation (input) {
  if (currentNumber != null) {
    checkCurrentNumber();
  }
  if(operationHistory.length >=1) {
    operationHistory.push(input);

    operationString = fixTimes(operationHistory).toString();
    operationString = operationString.replace(/\,/g," ");
    if (operationString.length > 36) {
      operationString = operationString.substr(operationString.length-37,operationString.length-1);
    }
    updateDisplay();
    operate();
  }
}

function fixTimes (checkArray) {
  let tempArr = Array.from(checkArray);

  while (tempArr.indexOf("*") >=0) {
    tempArr[tempArr.indexOf("*")] = "x";
  }
  return tempArr;
}

function updateCurrentNumber (numberAsString) {
  if (currentNumber === null) {
    currentNumber = numberAsString.toString();
  }
  else {
    if (zeroError === false) {
      currentNumber = currentNumber.toString() + numberAsString.toString();
    }
  }
  updateDisplay();
}

function clearAll () {
  if (zeroError === true) {
    enableAllButtons();
    zeroError = false;
  }
  operationHistory = [];
  currentNumber = null;
  operationString = "";
  total = 0;
  updateDisplay();
}

function clearHistory () {
  operationString = "";
  operationHistory = [];
  operationHistory.push(total);
  updateDisplay();
}

function backspace() {
  if (currentNumber != null) {
    currentNumber = currentNumber.slice(0,currentNumber.length-1);
    updateDisplay();
  }
}

function decimalCheck () {
  if (currentNumber.search(/\./) === -1) {
    updateCurrentNumber(".");
    hasDecimal = true;
    updateDisplay();
  }
}

function enableAllButtons () {
  let hasClassButton = Array.from(document.querySelectorAll(".disabled"));

  hasClassButton.forEach(function (node) {
    node.classList.remove("disabled");
    });
}

function disableAllButtons () {
  let isDisabled = Array.from(document.querySelectorAll(".button"));
  isDisabled.forEach(function (node) {
    node.classList.add("disabled");
    });
}

document.getElementById("1Button").addEventListener("click",function () {
  updateCurrentNumber('1');
});
document.getElementById("2Button").addEventListener("click",function () {
  updateCurrentNumber('2');
});
document.getElementById("3Button").addEventListener("click",function () {
  updateCurrentNumber('3');
});
document.getElementById("4Button").addEventListener("click",function () {
  updateCurrentNumber('4');
});
document.getElementById("5Button").addEventListener("click",function () {
  updateCurrentNumber('5');
});
document.getElementById("6Button").addEventListener("click",function () {
  updateCurrentNumber('6');
});
document.getElementById("7Button").addEventListener("click",function () {
  updateCurrentNumber('7');
});
document.getElementById("8Button").addEventListener("click",function () {
  updateCurrentNumber('8');
});
document.getElementById("9Button").addEventListener("click",function () {
  updateCurrentNumber('9');
});
document.getElementById("0Button").addEventListener("click",function () {
  updateCurrentNumber('0');
});
document.getElementById("plusButton").addEventListener("click",function () {
  addOperation('+');
});
document.getElementById("minusButton").addEventListener("click",function () {
  addOperation('-');
});
document.getElementById("timesButton").addEventListener("click",function () {
  addOperation('*');
});
document.getElementById("divideButton").addEventListener("click",function () {
  addOperation('/')
});
document.getElementById("clearButton").addEventListener("click",clearAll);
document.getElementById("delButton").addEventListener("click",backspace);
document.getElementById("equalsButton").addEventListener("click",function () {
  operate();
  clearHistory();
});
document.getElementById("decimalButton").addEventListener("click",decimalCheck);
document.addEventListener('keydown', function(event) {
  if (event.key === "1") {
    updateCurrentNumber('1');
  }
  if (event.key === "2") {
    updateCurrentNumber('2');
  }
  if (event.key === "3") {
    updateCurrentNumber('3');
  }
  if (event.key === "4") {
    updateCurrentNumber('4');
  }
  if (event.key === "5") {
    updateCurrentNumber('5');
  }
  if (event.key === "6") {
    updateCurrentNumber('6');
  }
  if (event.key === "7") {
    updateCurrentNumber('7');
  }
  if (event.key === "8") {
    updateCurrentNumber('8');
  }
  if (event.key === "9") {
    updateCurrentNumber('9');
  }
  if (event.key === "0") {
    updateCurrentNumber('0');
  }
  if (event.key === "+") {
    addOperation('+');
  }
  if (event.key === "-") {
    addOperation('-');
  }
  if (event.key === "*") {
    addOperation('*');
  }
  if (event.key === "/") {
    addOperation('/');
  }
  if (event.key === "Enter") {
    operate();
    clearHistory();
  }
  if (event.key === ".") {
    decimalCheck();
  }
  if (event.key === "Escape") {
    clearAll();
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    backspace();
  }
  });