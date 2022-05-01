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
playerHand = playerHand.flat()
let dealerHand = []
let playerHandPic = ""
let dealerHandPic = ""
let playerHandValue = 0
let dealerHandValue = 0



document.querySelector(".dealCards").addEventListener("click", function(e){
    e.preventDefault()
    walletStart()
    dealCards() 
});




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
        console.log(playerHand)
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
        if(cards.cards.value == "KING" || cards.cards.value == "QUEEN" || cards.cards.value == "JACK"){
            playerHandValue += 10
        } else if(cards.cards.value == "ACE" && playerHandValue < 10){
            playerHandValue += 11
        } else if(cards.cards.value == "ACE" && playerHandValue > 10){
            playerHandValue += 1
        } else {
            playerHandValue += parseInt(cards.cards.value)
        }
        console.log(playerHandValue)
    })
}


document.querySelector(".drawCard").addEventListener("click", function(e){
    if(playerHandValue < 21){
        hitCard()
        console.log(playerHand)
    }
})



//pairs and same suit will be ran immediately after first deal, if not hit then they are cleared. 

//player can press hit until they choose to end turn with end turn button, or draw over 21 and lose. 

//after player presses end turn, the dealer will proceed with their turn drawing until soft 17. 

// if player wins, they get 3:2 odds back and money is returned to wallet. If dealer wins then player loses money and board is reset. 




