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

function dealerShouldHit(dealerCards) {
  const handValue = cardArrayToTotal(dealerCards);
  if (!handValue.includes("soft")) {
    return parseInt(handValue) < 17;
  } else {
    // dealer hits on soft 17
    return parseInt(handValue.split("soft ")[1]) < 17;
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

      // write out list of cards in the shoe
      // var node = document.createElement("p");
      // node.innerHTML = `${card} (${count})`;
      // node.style.margin = 0;
      // cardOrder.appendChild(node); // Append the text to <li>
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
      console.log("new hand");
      // start the hand by reseting player and dealer cards
      let playerCards = [];
      let dealerCards = [];

      const countAtStart = currentCard === 0 ? 0 : deckInfo[currentCard].count;

      // this is needed to keep the pattern of incrementing the currentCard before accessing it
      currentCard = currentCard === 0 ? 0 : currentCard + 1;
      playerCards.push(deckInfo[currentCard].card);

      currentCard += 1;
      playerCards.push(deckInfo[currentCard].card);

      currentCard += 1;
      dealerCards.push(deckInfo[currentCard].card);

      currentCard += 1;
      dealerCards.push(deckInfo[currentCard].card);

      const dealerUpCardValue = dealerCards[0].split(" of ")[0];
      let situation = "";

      // handle player decisions
      if (isSplitSituation(playerCards, dealerUpCardValue)) {
        situation = "split";
      } else if (isDoubleSituation(playerCards, dealerUpCardValue)) {
        situation = "double";

        currentCard += 1;
        playerCards.push(deckInfo[currentCard].card);
      } else {
        situation = "standard";
        while (shouldHitStandardSituation(playerCards, dealerUpCardValue)) {
          currentCard += 1;
          playerCards.push(deckInfo[currentCard].card);
        }
      }

      // handle dealer decisions {

      // check if dealer player has any viable hands (more complicated for split)
      const playerTotalRaw = cardArrayToTotal(playerCards);
      let playerTotal = playerTotalRaw.includes("soft")
        ? parseInt(playerTotalRaw.split("soft ")[0])
        : parseInt(playerTotalRaw);

      // dealer has to maybe get cards
      if (playerTotal <= 21) {
        // let dealerTotalRaw = cardArrayToTotal(dealerCards);
        while (dealerShouldHit(dealerCards)) {
          currentCard += 1;
          dealerCards.push(deckInfo[currentCard].card);
        }
      } else {
        console.log("player busted");
      }

      const dealerTotalRaw = cardArrayToTotal(dealerCards);
      let dealerTotal = dealerTotalRaw.includes("soft")
        ? parseInt(dealerTotalRaw.split("soft ")[0])
        : parseInt(dealerTotalRaw);

      // determine result of hand
      let result = "--";
      if (playerTotal > 21) {
        result = "loss";
      } else if (dealerTotal > 21) {
        result = "win";
      } else if (playerTotal > dealerTotal) {
        result = "win";
      } else if (playerTotal < dealerTotal) {
        result = "loss";
      } else {
        result = "push";
      }

      handList.innerHTML += `
      <div class="single-hand">
        <div>count at start of hand: ${countAtStart}</div>
        <div>situation: ${situation}</div>
        <div>player cards:</div>
        <div>${playerCards.join(", ")} (${cardArrayToTotal(playerCards)})</div>
        <div>dealer cards: </div>
        <div>${dealerCards.join(", ")} (${cardArrayToTotal(dealerCards)})</div>
        <div>result of hand: ${result}</div>
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
