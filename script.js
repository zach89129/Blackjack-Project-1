//---- these three items set up the initial wallet as well as set the value of the wallet after betting. 
let walletPrompt = prompt("How much money did you bring today?", "insert value here")
document.querySelector("#walletValue").innerText = walletPrompt


let wallet = document.querySelector("#walletValue")
wallet.innerHTML = walletPrompt

///----------=======----------
let walletStart = function(){
    let standardBet = document.querySelector("#playerBet").value
    let pairsBet = document.querySelector("#pairs").value
    let suitBet = document.querySelector("#sameSuit").value
    let newWallet = parseInt(wallet.innerText) - parseInt(standardBet) - parseInt(suitBet) - parseInt(pairsBet);
    wallet.innerText = newWallet
    wallet = newWallet
    standardBet = parseInt(standardBet)
    console.log(standardBet)
    pairsBet = parseInt(pairsBet)
    console.log(pairsBet)
    suitBet = parseInt(suitBet)
}

//-----bet functions

let smallBets = function(){
    if(playerHand[0].value == playerHand[1].value){
        wallet += (pairsBet *10)
        console.log(wallet)
        alert("You won your pairs odds!")
    }
    if(playerHand[0].suit == playerHand[1].suit){
        wallet += (suitBet *6)
        console.log(wallet)
        alert("You won your suit odds!")
    }
}


//-----all needed global declaratios
let deckId = ""
let standardBet = ""
let suitBet = ""
let pairsBet = ""
let playerHand = []
let playerHandValues = []
playerHand = playerHand.flat()
let dealerHand = []
let dealerHandValues = []
dealerHand = dealerHand.flat()
let playerHandInitial = 0
let playerHandValue = playerHandValues.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    playerHandInitial
  );
let dealerHandInitial = 0
let dealerHandValue = dealerHandValues.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    dealerHandInitial
  );
let handValueHTML = document.getElementById("handValue")



//------ this is the button that starts the game with the initial bets. 
document.querySelector(".dealCards").addEventListener("click", function(e){
    e.preventDefault()
    if (deckId.length == 0){
        walletStart()
        dealCards() 
    } else {

    }
    
});

//-----these two functions cycle through the first 2 cards of the hand and transfer the string to numerical values, they also grab the images from the array and push them to the html. 
let handCounter = function(){
    playerHand = playerHand.flat()
    smallBets()
        if (playerHand.length === 2){
            playerHand.forEach(e => {
                let cardImage = document.createElement('img')
                cardImage.setAttribute("src", e.image)
                document.querySelector('#playerHand').appendChild(cardImage)
                if (e.value == "KING" || e.value == "QUEEN" || e.value == "JACK"){
                    playerHandValues.push(10)
                } else if (e.value == "ACE" && (playerHandValue +11) > 21){
                    playerHandValues.push(1)
                } else if (e.value == "ACE" && (playerHandValue + 11) < 21) {
                    playerHandValues.push(11)
                } else {
                    playerHandValues.push(parseInt(e.value))
                }
            })
        } else if (playerHand.length > 2){
            let lastCard = playerHand[playerHand.length -1]
            let cardImage = document.createElement('img')
                cardImage.setAttribute("src", lastCard.image)
                document.querySelector('#playerHand').appendChild(cardImage)
            if (lastCard.value == "KING" || lastCard.value == "QUEEN" || lastCard.value == "JACK"){
                playerHandValues.push(10)
            } else if (lastCard.value == "ACE" && (playerHandValue +11) > 21){
                playerHandValues.push(1)
            } else if (lastCard.value == "ACE" && (playerHandValue + 11) < 21) {
                playerHandValues.push(11)
            } else {
                playerHandValues.push(parseInt(lastCard.value))
            }
            if (playerHandValues.includes(11) && (playerHandValue + playerHandValues[playerHandValues.length -1]) > 21){
                let popAce = playerHandValues.indexOf(11)
                playerHandValues.splice(`${popAce}`, 1, 1)
            }
        }


        console.log(playerHand)
        console.log(playerHandValues)

        playerHandValue = playerHandValues.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            playerHandInitial
        );

        handValueHTML.innerHTML = playerHandValue
          console.log(playerHandValue)
}

//------same as above function but for dealer hand
let dealerHandCounter = function(){
    dealerHand = dealerHand.flat()
    let firstDraw = document.querySelector("#backOfCard")
    firstDraw.setAttribute("src", "https://i.pinimg.com/originals/25/42/c7/2542c7e8c0dad988ed003eb2218dc268.jpg")
    let secondDraw = document.querySelector("#secondCard")
    secondDraw.setAttribute("src", dealerHand[1].image)
        if (dealerHand.length === 2){
            dealerHand.forEach(e => {
                if (e.value == "KING" || e.value == "QUEEN" || e.value == "JACK"){
                    dealerHandValues.push(10)
                } else if (e.value == "ACE" && (dealerHandValue +11) > 21){
                    dealerHandValues.push(1)
                } else if (e.value == "ACE" && (dealerHandValue + 11) < 21) {
                    dealerHandValues.push(11)
                } else {
                    dealerHandValues.push(parseInt(e.value))
                }
            })
        } else if (dealerHand.length > 2){
            let lastCard = dealerHand[dealerHand.length -1]
            let cardImage = document.createElement('img')
                cardImage.setAttribute("src", lastCard.image)
                document.querySelector('#dealerHand').appendChild(cardImage)
            if (lastCard.value == "KING" || lastCard.value == "QUEEN" || lastCard.value == "JACK"){
                dealerHandValues.push(10)
            } else if (lastCard.value == "ACE" && (dealerHandValue +11) > 21){
                dealerHandValues.push(1)
            } else if (lastCard.value == "ACE" && (dealerHandValue + 11) < 21) {
                dealerHandValues.push(11)
            } else {
                dealerHandValues.push(parseInt(lastCard.value))
            }
            if (dealerHandValues.includes(11) && (dealerHandValue + dealerHandValues[dealerHandValues.length -1]) > 21){
                let popAce = dealerHandValues.indexOf(11)
                dealerHandValues.splice(`${popAce}`, 1, 1)
            }
        }


        console.log(dealerHand)
        console.log(dealerHandValues)

        dealerHandValue = dealerHandValues.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            dealerHandInitial
        );

        
          console.log(dealerHandValue)
}




//-----this function creates a deck from the API, grabs the deck id and then draws 2 cards for the player and 2 for the dealer. 
//------add an if statement with deck length modifier to prevent getting new id?
let dealCards = function(){
    fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => response.json())
    .then(function(data){
        console.log(data.deck_id)
        deckId = data.deck_id
    })
    .then(() => {
            fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        playerHand.push(cards.cards)
        // if(playerHand[0].value == playerHand[1].value){
        //     wallet += (pairsBet *10)
        // }
        // if(playerHand[0].suit == playerHand[1].suit){
        //     wallet += (suitBet *6)
        // }
        handCounter()
        
    })
    })
    .then(() => {
        fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        dealerHandCounter()
        
})})}

let continueGameDeal = function(){
    fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        playerHand.push(cards.cards)
        if(playerHand[0].value == playerHand[1].value){
            wallet += (pairsBet *10)
        }
        if(playerHand[0].suit == playerHand[1].suit){
            wallet += (suitBet *6)
        }
        handCounter()
        })
    .then(() => {
        fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        dealerHandCounter()
})})}
//------draws 1 card from deck and places in hand, then runse handcounter to get value

let hitCard = function(){
    fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(response => response.json())
    .then(cards => {
        playerHand.push(cards.cards)
        handCounter()
        if (playerHandValue > 21){
            setTimeout(function(){ alert("BUST!"); }, 1000);
           //----create a function to "reset" game 
        } 
    })
    
}

//------runs above function on button press. 
document.querySelector(".drawCard").addEventListener("click", function(e){
    if(playerHandValue < 21){
        hitCard()
    } 
})



//pairs and same suit will be ran immediately after first deal, if not hit then they are cleared. 

//player can press hit until they choose to end turn with end turn button, or draw over 21 and lose. 

//after player presses end turn, the dealer will proceed with their turn drawing until soft 17. 

// if player wins, they get 3:2 odds back and money is returned to wallet. If dealer wins then player loses money and board is reset. 




