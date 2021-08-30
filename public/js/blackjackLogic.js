// define helper functions

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function indexToCard(index) {
  if (index >= 0 && index <= 51) {
    suitIndex = Math.floor(index / 13);
    numberIndex = index % 13;
    var suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
    var numbers = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    return `${numbers[numberIndex]} of ${suits[suitIndex]}`;
  }
}

function updateCount(count, card) {
  if (
    card.includes("2") ||
    card.includes("3") ||
    card.includes("4") ||
    card.includes("5") ||
    card.includes("6")
  ) {
    return count + 1;
  } else if (card.includes("7") || card.includes("8") || card.includes("9")) {
    return count;
  } else {
    return count - 1;
  }
}

function cardArrayToTotal(cardArray) {
  let total = 0;
  let numAces = 0;
  let soft = false;

  cardArray.forEach((card) => {
    value = card.split(" of ")[0];
    if (value === "A") {
      numAces += 1;
    } else if (["J", "Q", "K"].includes(value)) {
      total += 10;
    } else {
      total += parseInt(value);
    }
  });

  // all aces except for the last one count as one
  if (numAces > 1) {
    total += numAces - 1;
    numAces = 1;
  }
  if (numAces === 1 && total <= 10) {
    soft = true;
    total += 11;
  } else if (numAces === 1 && total > 10) {
    soft = false; // this is just to be explicit
    total += 1;
  }
  return soft ? `soft ${total.toString()}` : total.toString();
}

function isDoubleSituation(playerCards, dealerUpCardValue) {
  if (
    cardArrayToTotal(playerCards) === "9" &&
    ["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (
    cardArrayToTotal(playerCards) === "10" &&
    !["10", "J", "Q", "K", "A"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (cardArrayToTotal(playerCards) === "11") {
    return true;
  } else if (
    cardArrayToTotal(playerCards) === "soft 13" &&
    ["5", "6"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (
    ["soft 14", "soft 15", "soft 16"].includes(cardArrayToTotal(playerCards)) &&
    ["4", "5", "6"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (
    cardArrayToTotal(playerCards) === "soft 17" &&
    ["3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (
    cardArrayToTotal(playerCards) === "soft 18" &&
    ["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (
    cardArrayToTotal(playerCards) === "soft 19" &&
    dealerUpCardValue === "6"
  ) {
    return true;
  } else {
    return false;
  }
}

function isSplitSituation(playerCards, dealerUpCardValue) {
  if (playerCards[0].split(" of ")[0] !== playerCards[1].split(" of ")[0]) {
    return false;
  } else {
    const pairedCard = playerCards[0].split(" of ")[0];
    // if paired card is ace or 8
    if (pairedCard === "8" || pairedCard === "A") {
      return true;
      // if paired card is 9
    } else if (
      pairedCard === "9" &&
      ["7", "10", "J", "Q", "K", "A"].includes(dealerUpCardValue)
    ) {
      return true;
      // if paired card is 7
    } else if (
      pairedCard === "7" &&
      ["2", "3", "4", "5", "6", "7"].includes(dealerUpCardValue)
    ) {
      return true;
      // if paired card is 9
    } else if (
      pairedCard === "6" &&
      ["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
    ) {
      return true;
    } else if (
      (pairedCard === "2" || pairedCard === "3") &&
      ["4", "5", "6", "7"].includes(dealerUpCardValue)
    ) {
      return true;
    }
  }
  return false;
}

function handleStandardSituation(playerCards, dealerUpCardValue) {
  handValue = parseInt(cardArrayToTotal(playerCards));
  if (handValue <= 11) {
    console.log(handValue, dealerUpCardValue, "hit");
  } else if (handValue === 12 && ["4", "5", "6"].includes(dealerUpCardValue)) {
    console.log(handValue, dealerUpCardValue, "stand");
  } else if (handValue === 12 && !["4", "5", "6"].includes(dealerUpCardValue)) {
    console.log(handValue, dealerUpCardValue, "hit");
  } else if (
    [13, 14, 15, 16].includes(handValue) &&
    ["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    console.log(handValue, dealerUpCardValue, "stand");
  } else if (
    [13, 14, 15, 16].includes(handValue) &&
    !["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    console.log(handValue, dealerUpCardValue, "hit");
  } else {
    console.log(handValue, dealerUpCardValue, "stand");
  }
}

// function handleSoftSituation(playerCards, dealerUpCardValue) {
//   const handValue = parseInt(cardArrayToTotal(playerCards).split);
// }

function getPlayerAction(playerCards, dealerUpCardValue) {
  let shouldStay = false;

  while (!shouldStay) {
    if (
      playerCards.length === 2 &&
      isSplitSituation(playerCards, dealerUpCardValue)
    ) {
      console.log("split", playerCards, dealerUpCardValue);
      return "split";
    } else if (
      playerCards.length === 2 &&
      isDoubleSituation(playerCards, dealerUpCardValue)
    ) {
      console.log("double", playerCards, dealerUpCardValue);
      return "double";
    } else if (cardArrayToTotal(playerCards).includes("soft")) {
      console.log("soft situation", playerCards);
      // return "soft";
    } else {
      handleStandardSituation(playerCards, dealerUpCardValue);
      return;
      // console.log("standard situation", playerCards);
    }
  }
}

// // wait for dom content before adding listeners
document.addEventListener("DOMContentLoaded", (event) => {
  // assign elements to javascript objectss
  const cardOrder = document.getElementById("card-order");
  const shuffleBtn = document.getElementById("shuffle-once-button");
  const startStopButton = document.getElementById("start-stop-button");
  const shufflesPerSecond = document.getElementById(
    "shuffles-per-second-value"
  );
  const shuffleSpeedSlider = document.getElementById(
    "shuffles-per-second-slider"
  );
  const summary = document.getElementById("summary");
  const handList = document.getElementById("hand-list");

  // create the deck of cards
  var deckArray = [];

  // add the cards to the deck
  let num_decks = 6;
  for (var i = 0; i < num_decks; i++) {
    for (var j = 0; j < 52; j++) {
      deckArray.push(j);
    }
  }

  // function to run for each shuffle
  shuffleBtn.addEventListener("click", () => {
    deckArray = shuffle(deckArray);
    cardOrder.innerHTML = "";

    // get the current count for each card in the deck
    let count = 0;
    let maxCount = 0;
    let minCount = 0;
    deckArray.forEach((num) => {
      const card = indexToCard(num);
      count = updateCount(count, card);
      maxCount = Math.max(count, maxCount);
      minCount = Math.min(count, minCount);

      var node = document.createElement("p");
      node.innerHTML = `${card} - ${count}`;
      node.style.margin = 0;
      cardOrder.appendChild(node); // Append the text to <li>
    });

    const deckInfo = deckArray.map((num) => {
      const card = indexToCard(num);
      count = updateCount(count, card);
      return {
        card,
        count,
      };
    });

    // reset handList and currentCard each shuffle
    handList.innerHTML = "";
    let currentCard = 0;

    // calculate/show as many hands as possible until
    while (currentCard < (2 / 3) * deckInfo.length) {
      // start the hand by reseting player and dealer cards
      let playerCards = [];
      let dealerCards = [];

      const countAtStart =
        currentCard === 0 ? 0 : deckInfo[currentCard - 1].count;

      playerCards.push(deckInfo[currentCard].card);
      playerCards.push(deckInfo[currentCard + 1].card);

      dealerCards.push(deckInfo[currentCard + 2].card);
      dealerCards.push(deckInfo[currentCard + 3].card);

      const dealerUpCardValue = dealerCards[0].split(" of ")[0];

      getPlayerAction(playerCards, dealerUpCardValue);

      currentCard += 4;

      handList.innerHTML += `
      <div class="single-hand">
        <div>count at start of hand: ${countAtStart}</div>
        <div>player cards:</div>
        <div>${playerCards.join(", ")} (${cardArrayToTotal(playerCards)})</div>
        <div>dealer cards: </div>
        <div>${dealerCards.join(", ")} (${cardArrayToTotal(dealerCards)})</div>
        <div>result of hand: --</div>
      </div>`;
    }

    summary.innerText = `max count: ${maxCount}, min count: ${minCount}`;
  });

  // define start/stop button functions
  function startSimulation(shufflesPerSecond) {
    intervalID = setInterval(() => {
      shuffleBtn.click();
    }, 1000 / shufflesPerSecond);
  }

  function stopSimulation() {
    clearInterval(intervalID);
  }

  // listen for slider changes and update field
  shuffleSpeedSlider.oninput = function () {
    shufflesPerSecond.innerHTML = this.value;
  };

  // define actions to happen when the simulation button is pressed
  startStopButton.addEventListener("click", () => {
    if (startStopButton.innerHTML === "Start") {
      startSimulation(shufflesPerSecond.innerHTML);
      startStopButton.innerHTML = "STOP";
      startStopButton.style.backgroundColor = "#E45252";
      startStopButton.style.color = "white";
    } else {
      stopSimulation();
      startStopButton.innerHTML = "Start";
      startStopButton.style.backgroundColor = "transparent";
      startStopButton.style.color = "#E45252";
    }
  });
});
//   // make working with dom elements easier
//   const rollBtn = document.getElementById("roll-once-button");
//   const numRolls = document.getElementById("rolls-value");
//   const totalTime = document.getElementById("time-simulated-value");
//   const summary = document.getElementById("summary");
//   const numShooters = document.getElementById("shooters-value");
//   const passNetUnits = document.getElementById("pass-net-units-value");
//   const passAndOddsNetUnits = document.getElementById(
//     "pass-odds-net-units-value"
//   );
//   const dontPassNetUnits = document.getElementById("dont-net-units-value");
//   const numWins = document.getElementById("wins-value");
//   const numLosses = document.getElementById("losses-value");
//   const currentPoint = document.getElementById("current-point");
//   const rollsPerShooter = document.getElementById("rolls-per-shooter-value");
//   const houseEdge = document.getElementById("house-edge-value");
//   const rollsPerSecond = document.getElementById("rolls-per-second-value");
//   const rollsSpeedSlider = document.getElementById("rolls-per-second-slider");
//   const startStopButton = document.getElementById("start-stop-button");
//   const percentile = document.getElementById("percentile-value");
//   const longestRoll = document.getElementById("longest-roll");
//   const shooterRollLength = document.getElementById("shooter-roll-length");
//   const oddsMultiplierInput = document.getElementById("odds-multiplier");

//   const bonusOps = document.getElementById("bonus-ops");
//   const allSmalls = document.getElementById("all-smalls");
//   const allTalls = document.getElementById("all-talls");
//   const makeEmAlls = document.getElementById("make-em-alls");
//   const luckEvaluator = document.getElementById("luck-evaluator");
//   const luckEvaluatorLeft = document.getElementById("luck-evaluator-left");
//   const luckEvaluatorRight = document.getElementById("luck-evaluator-right");
//   const halfWayLine = document.getElementById("half-way-line");
//   const luckEvaluatorInfo = document.getElementById("luck-evaluator-info");
//   const luckEvaluatorWins = document.getElementById("luck-evaluator-wins");
//   const luckEvaluatorLosses = document.getElementById("luck-evaluator-losses");
//   const luckEvaluatorPercentile = document.getElementById(
//     "luck-evaluator-percentile"
//   );
//   const distributionType = document.getElementById("distribution-type");
//   const luckEvaluatorPlaceHolder = document.getElementById(
//     "luck-evaluator-placeholder"
//   );

//   let allSmall = false;
//   let allTall = false;
//   let makeEmAll = false;

//   // set up odds multiplier
//   let oddsMultiplier = oddsMultiplierInput.value;
//   oddsMultiplierInput.addEventListener("input", () => {
//     oddsMultiplier = oddsMultiplierInput.value;
//   });

//   // set up roll tracker
//   let intervalID;
//   let PDFValues = {};
//   let allRollData = {};
//   let allTallSmall = {};
//   [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((num) => {
//     allRollData[num] = 0;
//     if (num !== 7) {
//       allTallSmall[num] = false;
//     }
//   });

//   // set up start/stop button
//   function stopSimulation() {
//     clearInterval(intervalID);
//   }

//   function startSimulation(rollsPerSecond) {
//     intervalID = setInterval(() => {
//       rollBtn.click();
//     }, 1000 / rollsPerSecond);
//   }

//   // listen for slider changes and update field
//   rollsSpeedSlider.oninput = function () {
//     rollsPerSecond.innerHTML = this.value;
//   };

//   startStopButton.addEventListener("click", () => {
//     if (startStopButton.innerHTML === "Start") {
//       // trigger on state
//       startSimulation(rollsPerSecond.innerHTML);
//       // styles
//       startStopButton.innerHTML = "STOP";
//       startStopButton.style.backgroundColor = "#E45252";
//       startStopButton.style.color = "white";
//     } else {
//       // trigger off state
//       stopSimulation();
//       // styles
//       startStopButton.innerHTML = "Start";
//       startStopButton.style.backgroundColor = "transparent";
//       startStopButton.style.color = "#E45252";
//     }
//   });

//   // function to run for every roll
//   rollBtn.addEventListener("click", function () {
//     // get dice result for the roll
//     let die1 = getRandomInt(6);
//     let die2 = getRandomInt(6);
//     let sum = die1 + die2;

//     // update rolls and time
//     numRolls.innerHTML = parseInt(numRolls.innerHTML) + 1;
//     totalTime.innerHTML = secondsToHms(parseInt(numRolls.innerHTML) * 15);
//     shooterRollLength.innerHTML = parseInt(shooterRollLength.innerHTML) + 1;
//     allRollData[sum] = allRollData[sum] + 1;

//     if (sum !== 7) {
//       allTallSmall[sum] = true;
//     } else {
//       // no 7
//       [2, 3, 4, 5, 6, 8, 9, 10, 11, 12].forEach((num) => {
//         allTallSmall[num] = false;
//       });
//       bonusOps.innerHTML = parseInt(bonusOps.innerHTML) + 1;
//       allSmall = false;
//       allTall = false;
//       makeEmAll = false;
//     }

//     Object.keys(allTallSmall).forEach((key) => {
//       currentCircle = document.getElementById(`number-circle-${key}`);
//       allTallSmall[key] === true
//         ? (currentCircle.style.backgroundColor = "#e45252")
//         : (currentCircle.style.backgroundColor = "transparent");
//     });

//     let currentColumn;
//     let maxRollCount = Math.max(...Object.values(allRollData));
//     Object.keys(allRollData).forEach((key) => {
//       currentColumn = document.getElementById(`roll-tracker-${key}`);
//       currentColumn.style.height = `${
//         (100 * allRollData[key]) / maxRollCount
//       }%`;
//     });

//     // pointNumber of zero indicated off state
//     let pointNumber =
//       currentPoint.innerHTML === "Off" ? 0 : parseInt(currentPoint.innerHTML);

//     // front line winner
//     if ((pointNumber === 0) & [7, 11].includes(sum)) {
//       passNetUnits.innerHTML = parseInt(passNetUnits.innerHTML) + 1;
//       dontPassNetUnits.innerHTML = parseInt(dontPassNetUnits.innerHTML) - 1;
//       passAndOddsNetUnits.innerHTML =
//         parseInt(passAndOddsNetUnits.innerHTML) + 1;
//       numWins.innerHTML = parseInt(numWins.innerHTML) + 1;
//       percentile.innerHTML = binomialCDF(
//         parseInt(numWins.innerHTML),
//         0.49293,
//         parseInt(numWins.innerHTML) + parseInt(numLosses.innerHTML)
//       );

//       // new shooter
//       if (summary.innerHTML.includes("Seven out loser: 7")) {
//         summary.innerHTML = `Front Line Winner: ${sum}<br>`;
//         numShooters.innerHTML = parseInt(numShooters.innerHTML) + 1;
//         // same shooter
//       } else {
//         summary.innerHTML = `Front Line Winner: ${sum}<br>` + summary.innerHTML;
//       }
//     }
//     // front line loser
//     else if ((pointNumber === 0) & [2, 3, 12].includes(sum)) {
//       passNetUnits.innerHTML = parseInt(passNetUnits.innerHTML) - 1;
//       if (sum !== 12) {
//         // 12 is a push
//         dontPassNetUnits.innerHTML = parseInt(dontPassNetUnits.innerHTML) + 1;
//       }
//       passAndOddsNetUnits.innerHTML =
//         parseInt(passAndOddsNetUnits.innerHTML) - 1;
//       numLosses.innerHTML = parseInt(numLosses.innerHTML) + 1;
//       percentile.innerHTML = binomialCDF(
//         parseInt(numWins.innerHTML),
//         0.49293,
//         parseInt(numWins.innerHTML) + parseInt(numLosses.innerHTML)
//       );

//       // new shooter
//       if (isNewShooter(summary.innerHTML)) {
//         summary.innerHTML = `Front Line Loser: ${sum}<br>`;
//         numShooters.innerHTML = parseInt(numShooters.innerHTML) + 1;
//         // same shooter
//       } else {
//         // summary.innerHTML += `Front Line Loser: ${sum}<br>`;
//         summary.innerHTML = `Front Line Loser: ${sum}<br>` + summary.innerHTML;
//       }
//     }
//     // point number established
//     else if ((pointNumber === 0) & [4, 5, 6, 8, 9, 10].includes(sum)) {
//       currentPoint.innerHTML = sum;
//       // new shooter
//       if (isNewShooter(summary.innerHTML)) {
//         summary.innerHTML = `New point established: ${sum}<br>`;
//         numShooters.innerHTML = parseInt(numShooters.innerHTML) + 1;
//         // same shooter
//       } else {
//         summary.innerHTML =
//           `New point established: ${sum}<br>` + summary.innerHTML;
//       }
//     }
//     // point number is rolled
//     else if ((pointNumber !== 0) & (sum === pointNumber)) {
//       passNetUnits.innerHTML = parseInt(passNetUnits.innerHTML) + 1;
//       dontPassNetUnits.innerHTML = parseInt(dontPassNetUnits.innerHTML) - 1;
//       if ([4, 10].includes(pointNumber)) {
//         passAndOddsNetUnits.innerHTML = (
//           parseInt(passAndOddsNetUnits.innerHTML) +
//           1 +
//           2 * oddsMultiplier
//         ).toFixed(1);
//       } else if ([5, 9].includes(pointNumber)) {
//         passAndOddsNetUnits.innerHTML = (
//           parseInt(passAndOddsNetUnits.innerHTML) +
//           1 +
//           1.5 * oddsMultiplier
//         ).toFixed(1);
//       } else if ([6, 8].includes(pointNumber)) {
//         passAndOddsNetUnits.innerHTML = (
//           parseInt(passAndOddsNetUnits.innerHTML) +
//           1 +
//           1.2 * oddsMultiplier
//         ).toFixed(1);
//       }
//       numWins.innerHTML = parseInt(numWins.innerHTML) + 1;
//       percentile.innerHTML = binomialCDF(
//         parseInt(numWins.innerHTML),
//         0.49293,
//         parseInt(numWins.innerHTML) + parseInt(numLosses.innerHTML)
//       );
//       summary.innerHTML = `Winner winner: ${sum}<br>` + summary.innerHTML;
//       currentPoint.innerHTML = "Off";
//     }
//     // seven out is rolled
//     else if ((pointNumber !== 0) & (sum === 7)) {
//       passNetUnits.innerHTML = parseInt(passNetUnits.innerHTML) - 1;
//       dontPassNetUnits.innerHTML = parseInt(dontPassNetUnits.innerHTML) + 1;
//       passAndOddsNetUnits.innerHTML =
//         parseInt(passAndOddsNetUnits.innerHTML) -
//         (1 + parseInt(oddsMultiplier));
//       numLosses.innerHTML = parseInt(numLosses.innerHTML) + 1;
//       percentile.innerHTML = binomialCDF(
//         parseInt(numWins.innerHTML),
//         0.49293,
//         parseInt(numWins.innerHTML) + parseInt(numLosses.innerHTML)
//       );
//       summary.innerHTML = `Seven out loser: 7<br>` + summary.innerHTML;
//       currentPoint.innerHTML = "Off";
//       // check if roll was the longest yet if so replace longest roll
//       if (
//         parseInt(shooterRollLength.innerHTML) > parseInt(longestRoll.innerHTML)
//       ) {
//         longestRoll.innerHTML = shooterRollLength.innerHTML;
//       }

//       // reset current shooter rolls
//       shooterRollLength.innerHTML = 0;

//       // during a point, a value that is not the point or seven is rolled
//     } else {
//       summary.innerHTML = `${sum}<br>` + summary.innerHTML;
//     }

//     // update rolls per shooter after numShooters is updated
//     rollsPerShooter.innerHTML = (
//       numRolls.innerHTML / Math.max(numShooters.innerHTML, 1)
//     ).toFixed(2);

//     houseEdge.innerHTML =
//       (
//         (-100 * passNetUnits.innerHTML) /
//         Math.max(parseInt(numWins.innerHTML) + parseInt(numLosses.innerHTML), 1)
//       ).toFixed(1) + "%";

//     // Check all small, tall, and make em all
//     const isTrue = (currentValue) => currentValue === true;
//     if (!allSmall) {
//       // map to make dictionary of true and false
//       let smallVals = [2, 3, 4, 5, 6].map((num) => {
//         return allTallSmall[num];
//       });

//       // check if all values are true
//       allSmall = smallVals.every(isTrue);

//       // increment counter
//       if (allSmall) {
//         allSmalls.innerHTML = parseInt(allSmalls.innerHTML) + 1;
//       }
//     }
//     if (!allTall) {
//       // map to make dictionary of true and false
//       let tallVals = [8, 9, 10, 11, 12].map((num) => {
//         return allTallSmall[num];
//       });

//       // check if all values are true
//       allTall = tallVals.every(isTrue);

//       // increment counter
//       if (allTall) {
//         allTalls.innerHTML = parseInt(allTalls.innerHTML) + 1;
//       }
//     }
//     if (!makeEmAll & (allTall & allSmall)) {
//       makeEmAll = true;
//       makeEmAlls.innerHTML = parseInt(makeEmAlls.innerHTML) + 1;
//     }

//     // fills in luck evaluator
//     let totalDescisions =
//       parseInt(numWins.innerHTML) + parseInt(numLosses.innerHTML);

//     // one time additions
//     if (totalDescisions === 3) {
//       // before halfway line is display: none
//       halfWayLine.style.display = "inline-block";
//       distributionType.style.display = "block";
//       luckEvaluatorPlaceHolder.style.display = "none";
//       luckEvaluatorLeft.style.display = "flex";
//       luckEvaluatorRight.style.display = "flex";
//     }

//     // one time additions
//     if (totalDescisions === 150) {
//       // before halfway line is display: none
//       distributionType.innerHTML = "Normal Approximation";
//     }

//     // recurring additions
//     if (totalDescisions >= 3) {
//       // create an object with keys = all possible number of wins, values = PDF output for each value
//       let possibleWinValues = [];

//       for (var i = 0; i <= totalDescisions; i++) {
//         possibleWinValues.push(i);
//       }

//       PDFValues = {};
//       possibleWinValues.forEach((wins) => {
//         PDFValues[wins] = parseFloat(
//           binomialPMF(wins, 0.49293, totalDescisions)
//         );
//       });

//       let maxProb = Math.max.apply(Math, Object.values(PDFValues));

//       while (luckEvaluatorLeft.firstChild) {
//         luckEvaluatorLeft.removeChild(luckEvaluatorLeft.firstChild);
//       }
//       while (luckEvaluatorRight.firstChild) {
//         luckEvaluatorRight.removeChild(luckEvaluatorRight.firstChild);
//       }

//       let numLeftColumns = 0;
//       let numRightColumns = 0;

//       Object.keys(PDFValues).forEach((wins) => {
//         let losses = Object.keys(PDFValues).length - wins - 1;
//         console.log(wins, losses);
//         // add the column to the chart
//         var column = document.createElement("LI");
//         column.style.height = `${(100 * PDFValues[wins]) / maxProb}%`;
//         column.style.width = "100%";
//         column.style.flex = parseInt(wins) === losses ? "1" : "2";

//         // set the color of the column to indicate the current number of wins
//         column.style.backgroundColor =
//           wins === numWins.innerHTML ? "white" : "#e45252";

//         if (parseInt(wins) < losses && PDFValues[wins] > 0.001) {
//           numLeftColumns += 1;
//           luckEvaluatorLeft.appendChild(column);
//         }
//         if (parseInt(wins) === losses && PDFValues[wins] > 0.001) {
//           luckEvaluatorRight.appendChild(column);
//           var columnClone = column.cloneNode(true);
//           columnClone.addEventListener("mouseenter", () => {
//             // update wins and losses values
//             luckEvaluatorWins.innerHTML = `wins: ${wins}`;
//             luckEvaluatorLosses.innerHTML = `losses: ${losses}`;
//             luckEvaluatorPercentile.innerHTML = `percentile: ${binomialCDF(
//               parseInt(wins),
//               0.49293,
//               parseInt(wins) + losses
//             )}`;
//             // show the info div
//             luckEvaluatorInfo.style.display = "block";
//             // change the column color
//             columnClone.style.borderStyle = "solid";
//             columnClone.style.borderWidth = "1px";
//             columnClone.style.borderColor = "#fff383";
//           });

//           columnClone.addEventListener("mouseleave", () => {
//             // hide info div
//             luckEvaluatorInfo.style.display = "none";

//             // change column color back
//             columnClone.style.borderStyle = "none";
//           });
//           luckEvaluatorLeft.appendChild(columnClone);
//         }
//         if (parseInt(wins) > losses && numLeftColumns > numRightColumns) {
//           numRightColumns += 1;
//           luckEvaluatorRight.appendChild(column);
//         }

//         column.addEventListener("mouseenter", () => {
//           // update wins and losses values
//           luckEvaluatorWins.innerHTML = `wins: ${wins}`;
//           luckEvaluatorLosses.innerHTML = `losses: ${losses}`;
//           luckEvaluatorPercentile.innerHTML = `percentile: ${binomialCDF(
//             parseInt(wins),
//             0.49293,
//             parseInt(wins) + losses
//           )}`;
//           // show the info div
//           luckEvaluatorInfo.style.display = "block";
//           // change the column color
//           column.style.borderStyle = "solid";
//           column.style.borderWidth = "1px";
//           column.style.borderColor = "#fff383";
//         });

//         column.addEventListener("mouseleave", () => {
//           // hide info div
//           luckEvaluatorInfo.style.display = "none";

//           // change column color back
//           column.style.borderStyle = "none";
//         });
//       });
//     }
//   });
// });
