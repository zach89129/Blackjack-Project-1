//Declarations
let walletPrompt = prompt("How much money did you bring today?", "insert value here")
document.querySelector("#walletValue").innerText = walletPrompt

// let wallet = ""
let wallet = document.querySelector("#walletValue")
wallet.innerHTML = walletPrompt

let walletStart = function(){
    let standardBet = document.querySelector("#playerBet").value
    // console.log(standardBet)
    let newWallet = parseInt(wallet.innerText) - parseInt(standardBet);
    wallet.innerText = newWallet
    wallet = newWallet
}


let deckId = ""
let standardBet = ""
let splitBet = ""
let pairsBet = ""
let playerHand = []
let playerHandValues = []
playerHand = playerHand.flat()
let dealerHand = []
let dealerHandValues = []
let playerHandPic = ""
let dealerHandPic = ""
let playerHandInitial = 0
let playerHandValue = playerHandValues.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    playerHandInitial
  );
let dealerHandInitial = 0



document.querySelector(".dealCards").addEventListener("click", function(e){
    e.preventDefault()
    walletStart()
    dealCards() 
});


let handCounter = function(){
    playerHand = playerHand.flat()
        console.log(playerHand)
        playerHand.forEach(e => {
            if (e.value == "KING" || e.value == "QUEEN" || e.value == "JACK"){
                playerHandValues.push(10)
            } else if (e.value == "ACE" && playerHandValue < 10){
                playerHandValues.push(11)
            } else if (e.value == "ACE" && playerHandValue > 10) {
                playerHandValues.push(1)
            } else {
                playerHandValues.push(parseInt(e.value))
                // playerHandValues.splice(0, playerHandValues.length ,(parseInt(e.value)))
            }
        });

        console.log(playerHandValues)

        playerHandValue = playerHandValues.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            playerHandInitial
          );
}

//on "Deal!" button press player gets handed 2 cards and dealer gets 1 facedown, 1 faceup. 
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
        // let playerHand = cards.cards
        // return playerHand
        console.log(playerHand)
        handCounter()
        console.log(playerHandValue)
    })
    })
    .then(() => {
        fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        console.log(dealerHand)
        // playerHand.forEach(e => {
        //     if (e.value == "KING" || e.value == "QUEEN" || e.value == "JACK"){
        //         playerHandValues.push(10)
        //     // } else if ()
        //     } else {
        //     playerHandValues.push(parseInt(e.value))
        //     }
        // });
        // let playerHandValue = playerHandValues.reduce(
        //     (previousValue, currentValue) => previousValue + currentValue,
        //     playerHandInitial
        // );
        // console.log(playerHandValue)
        
        
})
})
    console.log(wallet)
    
}


//player draw tied to button, 3 different bet values to track.
let hitCard = function(){
    fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(response => response.json())
    .then(cards => {
        playerHand.push(cards.cards)
        console.log(playerHand)
        handCounter()
        console.log(playerHandValue)
        // playerHand = playerHand.flat()
        // playerHand.forEach(e => {
        //     if (e.value == "KING" || e.value == "QUEEN" || e.value == "JACK"){
        //         playerHandValues.push(10)
        //     } else if (e.value == "ACE" && playerHandValue < 10){
        //         playerHandValues.push(11)
        //     } else if (e.value == "ACE" && playerHandValue > 10) {
        //         playerHandValues.push(1)
        //     } else {
        //         playerHandValues.push(parseInt(e.value))
        //     }
        // });

        // console.log(playerHandValues)

        // let playerHandValue = playerHandValues.reduce(
        //     (previousValue, currentValue) => previousValue + currentValue,
        //     playerHandInitial
        //   );
        // console.log(playerHandValue)



        // if(cards.cards.value == "KING" || cards.cards.value == "QUEEN" || cards.cards.value == "JACK"){
        //     playerHandValue += 10
        // } else if(cards.cards.value == "ACE" && playerHandValue < 10){
        //     playerHandValue += 11
        // } else if(cards.cards.value == "ACE" && playerHandValue > 10){
        //     playerHandValue += 1
        // } else {
        //     playerHandValue += parseInt(cards.cards.value)
        // }
        // console.log(playerHandValue)
    })
}


document.querySelector(".drawCard").addEventListener("click", function(e){
    if(playerHandValue < 100){
        hitCard()
        console.log(playerHand)
    }
})



//pairs and same suit will be ran immediately after first deal, if not hit then they are cleared. 

//player can press hit until they choose to end turn with end turn button, or draw over 21 and lose. 

//after player presses end turn, the dealer will proceed with their turn drawing until soft 17. 

// if player wins, they get 3:2 odds back and money is returned to wallet. If dealer wins then player loses money and board is reset. 




