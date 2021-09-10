// define helper functions
const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces);
  return Math.round(number * factorOfTen) / factorOfTen;
};

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
    var suits = ["♥", "♠", "♣", "♦"];
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

function shouldHitSoftSituation(playerCards, dealerUpCardValue) {
  const handValue = parseInt(cardArrayToTotal(playerCards).split("soft ")[1]);
  if (handValue <= 16) {
    return true;
  } else if (
    handValue === 17 &&
    !["2", "3", "4", "5", "6", "7", "8"].includes(dealerUpCardValue)
  ) {
    return true;
  } else if (
    handValue === 17 &&
    ["2", "3", "4", "5", "6", "7", "8"].includes(dealerUpCardValue)
  ) {
    return false;
  } else {
    return false;
  }
}

function shouldHitStandardSituation(playerCards, dealerUpCardValue) {
  // check if it is a soft hand situation
  if (cardArrayToTotal(playerCards).includes("soft")) {
    return shouldHitSoftSituation(playerCards, dealerUpCardValue);
  }
  // else handle standard situations
  const handValue = parseInt(cardArrayToTotal(playerCards));
  if (handValue <= 11) {
    return true;
  } else if (handValue === 12 && ["4", "5", "6"].includes(dealerUpCardValue)) {
    return false;
  } else if (handValue === 12 && !["4", "5", "6"].includes(dealerUpCardValue)) {
    return true;
  } else if (
    [13, 14, 15, 16].includes(handValue) &&
    ["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    return false;
  } else if (
    [13, 14, 15, 16].includes(handValue) &&
    !["2", "3", "4", "5", "6"].includes(dealerUpCardValue)
  ) {
    return true;
  } else {
    false;
  }
}

// dealer hits soft 17
function dealerShouldHit(dealerHand) {
  const dealerHandTotalRaw = cardArrayToTotal(dealerHand);
  if (dealerHandTotalRaw.includes("soft")) {
    const playerHandTotal = parseInt(dealerHandTotalRaw.split("soft ")[1]);
    return playerHandTotal <= 17;
  } else {
    const playerHandTotal = parseInt(dealerHandTotalRaw);
    return playerHandTotal <= 16;
  }
}

// wait for dom content before adding listeners
document.addEventListener("DOMContentLoaded", (event) => {
  // assign elements to javascript objects
  const shuffleBtn = document.getElementById("shuffle-once-button");
  const startStopButton = document.getElementById("start-stop-button");
  const shufflesPerSecond = document.getElementById(
    "shuffles-per-second-value"
  );
  const shuffleSpeedSlider = document.getElementById(
    "shuffles-per-second-slider"
  );
  const handsValue = document.getElementById("hands-value");
  const handList = document.getElementById("hand-list");
  const currentPlusMinusValue = document.getElementById(
    "current-plus-minus-value"
  );
  const frequencyGraph = document.getElementById("frequency-graph");
  const frequencyGraphPlaceholder = document.getElementById(
    "frequency-graph-placeholder"
  );
  const frequencyInfo = document.getElementById("frequency-info");
  const frequencyCount = document.getElementById("frequency-count");
  const frequencyTrials = document.getElementById("frequency-trials");
  const frequencyPercent = document.getElementById("frequency-percent");

  const expectedValueGraph = document.getElementById("expected-value-graph");
  const expectedValuePlaceholder = document.getElementById(
    "expected-value-placeholder"
  );
  const expectedValueInfo = document.getElementById("expected-value-info");
  const expectedValueCount = document.getElementById("expected-value-count");
  const expectedValueTrials = document.getElementById("expected-value-trials");
  const expectedValueValue = document.getElementById(
    "expected-value-expected-value"
  );

  // create the deck of cards
  var deckArray = [];

  // add the cards to the deck
  let num_decks = 6;
  for (var i = 0; i < num_decks; i++) {
    for (var j = 0; j < 52; j++) {
      deckArray.push(j);
    }
  }

  // define results holder
  let resultsHolder = {};

  for (let i = -25; i <= 25; i++) {
    resultsHolder[i.toString()] = {
      trials: 0,
      netPlusMinus: 0,
      expectedValue: 0,
    };
  }

  // function to run for each shuffle
  shuffleBtn.addEventListener("click", () => {
    frequencyGraphPlaceholder.style.display = "none";
    expectedValuePlaceholder.style.display = "none";

    deckArray = shuffle(deckArray);

    // get the current count for each card in the deck
    let count = 0;
    let maxCount = 0;
    let minCount = 0;

    // calculate the count at each card up front
    const deckInfo = deckArray.map((num) => {
      const card = indexToCard(num);
      count = updateCount(count, card);
      maxCount = Math.max(count, maxCount);
      minCount = Math.min(count, minCount);
      return {
        card,
        count,
      };
    });

    // reset handList and currentCard each shuffle
    handList.innerHTML = "";
    let currentCard = 0;
    let currentHand = 0;

    // let remainingCards = 312

    // calculate/show as many hands as possible until
    while (currentCard < (2 / 3) * deckInfo.length) {
      // start the hand by reseting player and dealer cards
      let playerCards = [];
      let dealerCards = [];

      // the first card has a count, but should be zero
      const countAtHandStart =
        currentCard === 0 ? 0 : deckInfo[currentCard].count;

      const remainingCards =
        currentCard === 0 ? 312 - currentCard : 311 - currentCard;

      const trueCount = countAtHandStart / (remainingCards / 52);

      // update the hand number
      currentHand = currentCard === 0 ? 0 : currentHand + 1;

      // Keep the pattern of incrementing the currentCard before accessing it
      currentCard = currentCard === 0 ? 0 : currentCard + 1;

      // add first card to playerCards
      playerCards.push(deckInfo[currentCard].card);

      // add second card to playerCards
      currentCard += 1;
      playerCards.push(deckInfo[currentCard].card);

      // add first card to dealerCards
      currentCard += 1;
      dealerCards.push(deckInfo[currentCard].card);

      // add second card to dealerCards
      currentCard += 1;
      dealerCards.push(deckInfo[currentCard].card);

      const dealerUpCardValue = dealerCards[0].split(" of ")[0];

      // define an array to hold the player hands
      let playerHands = [];

      // determine if player needs to needs to split hands
      if (isSplitSituation(playerCards, dealerUpCardValue)) {
        // currently only allows for a single split
        // I probably could use a while loop to ensure all splitable hands are split
        currentCard += 1;
        playerHands.push([playerCards[0], deckInfo[currentCard].card]);
        currentCard += 1;
        playerHands.push([playerCards[1], deckInfo[currentCard].card]);
      } else {
        // playerHands with be an array with a single array
        playerHands.push(playerCards);
      }

      // define a variable to keep track of if dealer needs to play
      isViablePlayerHand = false;

      // Handle the drawing of player cards to get player results
      playerResults = playerHands.map((playerHand) => {
        let isDouble = false;

        // check if it is a double situation
        if (isDoubleSituation(playerHand, dealerUpCardValue)) {
          isDouble = true;
          // player automatically only gets one card
          currentCard += 1;
          playerHand.push(deckInfo[currentCard].card);
        } else {
          situation = "standard";
          // add cards to player hand until a stopping condition
          while (shouldHitStandardSituation(playerHand, dealerUpCardValue)) {
            currentCard += 1;
            playerHand.push(deckInfo[currentCard].card);
          }
        }

        // get the hand total as a number
        // this is probably the place to check for blackjack
        const playerHandTotalRaw = cardArrayToTotal(playerHand);
        let playerTotal = playerHandTotalRaw.includes("soft")
          ? parseInt(playerHandTotalRaw.split("soft ")[1])
          : parseInt(playerHandTotalRaw);

        // check if the hand is a blackjack
        const isBlackJack = playerTotal === 21 && playerHand.length === 2;

        // update isViablePlayerHand to indicate whether the player has a viable hand
        if (playerTotal <= 21) {
          isViablePlayerHand = true;
        }

        // return the need information for player hand
        return {
          playerHand: playerHand,
          total: playerTotal,
          isDouble: isDouble,
          isBlackJack: isBlackJack,
        };
      });

      // potentially need to have if the dealer has blackjack
      // might need to see if all player hands are blackjack,
      // so the if the dealer doesn't have a blackjack, no
      // cards are drawn for the dealer

      // this could go higer up, to prevent player from drawing cards
      dealerBlackJack = false;

      dealerTotalRaw = cardArrayToTotal(dealerCards);
      let dealerTotal = dealerTotalRaw.includes("soft")
        ? parseInt(dealerTotalRaw.split("soft ")[1])
        : parseInt(dealerTotalRaw);

      // handle drawing dealer cards
      if (isViablePlayerHand) {
        while (dealerShouldHit(dealerCards)) {
          currentCard += 1;
          dealerCards.push(deckInfo[currentCard].card);
        }

        dealerTotalRaw = cardArrayToTotal(dealerCards);
        dealerTotal = dealerTotalRaw.includes("soft")
          ? parseInt(dealerTotalRaw.split("soft ")[1])
          : parseInt(dealerTotalRaw);

        // after drawing all dealer cards check if dealer has blackjack
        if (dealerTotal === 21 && dealerCards.length === 2) {
          dealerBlackJack = true;
        }
      }

      // get plus minus before evaluating the player's hands
      let currentPlusMinus = parseInt(currentPlusMinusValue.innerText);

      // map over player results to determine outcome of each player hand
      playerResults = playerResults.map((result) => {
        let outcome;
        let handPlusMinus;
        if (result.total > 21 && !result.isDouble) {
          // loss
          handPlusMinus = -1;
          outcome = "Loss from player bust";
        } else if (result.total > 21 && result.isDouble) {
          // double loss
          handPlusMinus = -2;
          outcome = "Double loss from player bust";
        } else if (result.isBlackJack && dealerBlackJack) {
          // push
          handPlusMinus = 0;
          outcome = "Blackjack push";
        } else if (result.isBlackJack && !dealerBlackJack) {
          // blackjack win
          handPlusMinus = 1.5;
          outcome = "Blackjack win";
        } else if (dealerTotal > 21 && !result.isDouble) {
          // win
          handPlusMinus = 1;
          outcome = "Win from dealer bust";
        } else if (dealerTotal > 21 && result.isDouble) {
          // double win
          handPlusMinus = 2;
          outcome = "Double win from dealer bust";
        } else if (result.total > dealerTotal && !result.isDouble) {
          // win
          handPlusMinus = 1;
          outcome = "Win from higher total";
        } else if (result.total > dealerTotal && result.isDouble) {
          // double win
          handPlusMinus = 2;
          outcome = "Double win from higher total";
        } else if (result.total < dealerTotal && !result.isDouble) {
          // loss
          handPlusMinus = -1;
          outcome = "Loss from higher total";
        } else if (result.total < dealerTotal) {
          // double loss
          handPlusMinus = -2;
          outcome = "Double loss from higher total";
        } else {
          // push
          handPlusMinus = 0;
          outcome = "Equal hand value push";
        }
        return { ...result, handPlusMinus, outcome };
      });

      let playerHandString = "";
      let roundPlusMinus = 0;

      playerResults.forEach((hand) => {
        playerHandString += `<div class="single-hand-row">Player hand: ${
          hand.total
        } (${hand.playerHand.join(", ")})</div>
        <div class="single-hand-row">${hand.outcome}</div>`;
        roundPlusMinus += hand.handPlusMinus;
        currentPlusMinus += hand.handPlusMinus;

        // add result to the result holder object
        const currentCount = Math.round(trueCount).toString();
        resultsHolder[currentCount]["trials"] += 1;
        resultsHolder[currentCount]["netPlusMinus"] += hand.handPlusMinus;
        resultsHolder[currentCount]["expectedValue"] =
          resultsHolder[currentCount]["netPlusMinus"] /
          resultsHolder[currentCount]["trials"];
      });

      currentPlusMinusValue.innerText = currentPlusMinus;

      // need to fix the toPercision to be to a certain number of decimal places

      // display results
      handList.innerHTML += `
      <div class="single-hand">
        <div class="hand-number">Hand ${currentHand + 1}</div>
        <div class="single-hand-row">Count is ${countAtHandStart} with ${remainingCards} remaining cards (True ${round(
        trueCount,
        2
      )})</div>
        <div class="single-hand-row">Dealer hand: ${dealerTotal} (${dealerCards.join(
        ", "
      )})</div>
        ${playerHandString}
        <div class="single-hand-row">Result of hand: ${
          roundPlusMinus > 0 ? "+" + roundPlusMinus : roundPlusMinus
        }</div>
        <div class="single-hand-row">Running +/-: ${
          currentPlusMinus > 0 ? "+" + currentPlusMinus : currentPlusMinus
        }</div>
      </div>`;
    }

    // update the current number of hands
    handsValue.innerText = parseInt(handsValue.innerText) + currentHand + 1;

    // clear columns from frequency graph
    while (frequencyGraph.firstChild) {
      frequencyGraph.removeChild(frequencyGraph.firstChild);
    }

    // define values for plotting
    let maxDisplayCount = 0;
    let maxFrequency = 0;
    let maxExpectedValue = 0;
    let totalTrials = 0;
    const minTrials = 30; // determines minimum number to be shown on expected value graph

    // find the largest absolute value of a count that has a trial
    Object.keys(resultsHolder).forEach((count) => {
      const countData = resultsHolder[count.toString()];
      if (countData.trials != 0) {
        maxDisplayCount = Math.max(maxDisplayCount, Math.abs(count.toString()));
        maxFrequency = Math.max(maxFrequency, countData.trials);
        totalTrials += countData.trials;
      }
      if (countData.trials >= minTrials) {
        maxExpectedValue = Math.max(
          maxExpectedValue,
          Math.abs(countData.expectedValue)
        );
      }
    });

    // create a list that can be used for plotting
    let plottedValues = [];
    for (var i = -1 * maxDisplayCount; i <= maxDisplayCount; i++) {
      plottedValues.push(i.toString());
    }

    // calculate the height of each column to add to frequency graph
    plottedValues.forEach((countVal) => {
      const countData = resultsHolder[countVal];
      var column = document.createElement("LI");
      column.style.height = `${100 * (countData.trials / maxFrequency)}%`;
      column.style.width = "100%";
      column.style.backgroundColor = "#e45252";

      column.addEventListener("mouseenter", () => {
        frequencyCount.innerHTML = `Count: ${countVal}`;
        frequencyTrials.innerHTML = `Trials: ${countData.trials}`;
        frequencyPercent.innerHTML = `Percent: ${round(
          100 * (countData.trials / totalTrials),
          1
        )}%`;

        frequencyInfo.style.display = "block";

        column.style.borderStyle = "solid";
        column.style.borderWidth = "1px";
        column.style.borderColor = "#fff383";
      });

      column.addEventListener("mouseleave", () => {
        // hide info div
        frequencyInfo.style.display = "none";

        // change column color back
        column.style.borderStyle = "none";
      });

      frequencyGraph.appendChild(column);
    });

    // clear columns from expectedValue graph
    while (expectedValueGraph.firstChild) {
      expectedValueGraph.removeChild(expectedValueGraph.firstChild);
    }

    // console.log(resultsHolder);

    // calculate the height of each column to add to frequency graph
    plottedValues.forEach((countVal) => {
      const countData = resultsHolder[countVal];

      // height of plot is 150px, so half height is 75px
      const barValue =
        countData.trials >= minTrials
          ? countData.expectedValue / maxExpectedValue
          : 0;
      const barHeight = 75 * Math.abs(barValue);
      const marginTop = barValue > 0 ? `${75 - barHeight}` : "75";

      console.log(countVal, barValue, marginTop);

      var column = document.createElement("LI");
      column.style.height = `${barHeight}px`;
      column.style.marginTop = `${marginTop}px`;
      column.style.width = "100%";
      column.style.backgroundColor = "#e45252";

      column.addEventListener("mouseenter", () => {
        expectedValueCount.innerHTML = `Count: ${countVal}`;
        expectedValueTrials.innerHTML = `Trials: ${countData.trials}`;
        expectedValueValue.innerHTML = `Exp. val.: ${round(
          countData.expectedValue,
          3
        )}`;

        expectedValueInfo.style.display = "block";

        column.style.borderStyle = "solid";
        column.style.borderWidth = "1px";
        column.style.borderColor = "#fff383";
      });

      column.addEventListener("mouseleave", () => {
        // hide info div
        expectedValueInfo.style.display = "none";

        // change column color back
        column.style.borderStyle = "none";
      });

      expectedValueGraph.appendChild(column);
    });
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
