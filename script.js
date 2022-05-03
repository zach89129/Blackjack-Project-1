//---- these three items set up the initial wallet as well as set the value of the wallet after betting. 
let walletPrompt = prompt("How much money did you bring today?", "insert value here")
document.querySelector("#walletValue").innerText = walletPrompt


let wallet = document.querySelector("#walletValue")
wallet.innerHTML = walletPrompt


let walletStart = function(){
    let standardBet = document.querySelector("#playerBet").value
    let newWallet = parseInt(wallet.innerText) - parseInt(standardBet);
    wallet.innerText = newWallet
    wallet = newWallet
}

//-----all needed global declaratios
let deckId = ""
let standardBet = ""
let splitBet = ""
let pairsBet = ""
let playerHand = []
let playerHandValues = []
playerHand = playerHand.flat()
let dealerHand = []
let dealerHandValues = []
dealerHand = dealerHand.flat()
// let playerHandPic = ""
// let dealerHandPic = ""
let playerHandInitial = 0
let playerHandValue = playerHandValues.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    playerHandInitial
  );
let dealerHandInitial = 0


//------ this is the button that starts the game with the initial bets. 
document.querySelector(".dealCards").addEventListener("click", function(e){
    e.preventDefault()
    walletStart()
    dealCards() 
});

//-----these two functions cycle through the first 2 cards of the hand and transfer the string to numerical values, they also grab the images from the array and push them to the html. 
let handCounter = function(){
    playerHand = playerHand.flat()
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

        // if (playerHandValues.includes(11) && (playerHandValue + lastCard.value) > 21){
        //     let popAce = playerHandValues.indexOf(11)
        //     playerHandValues.splice(`${popAce}`, 1, 1)
        // }

        console.log(playerHand)
        console.log(playerHandValues)

        playerHandValue = playerHandValues.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            playerHandInitial
        );

          console.log(playerHandValue)
}





//-----this function creates a deck from the API, grabs the deck id and then draws 2 cards for the player and 2 for the dealer. 

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
        handCounter()
    })
    })
    .then(() => {
        fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        console.log(dealerHand)
        
        
        
})})}


//------draws 1 card from deck and places in hand, then runse handcounter to get value

let hitCard = function(){
    fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(response => response.json())
    .then(cards => {
        playerHand.push(cards.cards)
        handCounter()
    })
}

//------runs above function on button press. 
document.querySelector(".drawCard").addEventListener("click", function(e){
    if(playerHandValue < 100){
        hitCard()
    } 
})



//pairs and same suit will be ran immediately after first deal, if not hit then they are cleared. 

//player can press hit until they choose to end turn with end turn button, or draw over 21 and lose. 

//after player presses end turn, the dealer will proceed with their turn drawing until soft 17. 

// if player wins, they get 3:2 odds back and money is returned to wallet. If dealer wins then player loses money and board is reset. 




