// //---- these three items set up the initial wallet as well as set the value of the wallet after betting. 
// let walletPrompt = prompt("How much money did you bring today?", "insert value here")
// document.querySelector("#walletValue").innerText = walletPrompt


// let wallet = document.querySelector("#walletValue")
// wallet.innerHTML = walletPrompt

// ///----------=======----------
let walletStart = function(){
    standardBet = document.querySelector("#playerBet").value
    pairsBet = document.querySelector("#pairs").value
    suitBet = document.querySelector("#sameSuit").value
    standardBet = parseInt(standardBet)
    console.log(standardBet)
    pairsBet = parseInt(pairsBet)
    suitBet = parseInt(suitBet)

    wallet -= standardBet + suitBet + pairsBet
    
    return standardBet
}
let wallet = 20000
document.querySelector("#walletValue").innerText = wallet
//-----bet functions

let smallBets = function(){
    if(playerHand[0].value == playerHand[1].value){
        wallet += pairsBet *10
        alert("You won your pairs odds!")
        fixWallet()
    }
    if(playerHand[0].suit == playerHand[1].suit){
        wallet += suitBet *6
        alert("You won your suit odds!")
        fixWallet()
    }
}


//-----all needed global declaratios
let deckId = ""
let standardBet 
let suitBet  
let pairsBet 
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

let secondDraw = document.querySelector("#secondCard")
let firstDraw = document.querySelector("#backOfCard")


//------ this is the button that starts the game with the initial bets. 
document.querySelector(".dealCards").addEventListener("click", function(e){
    e.preventDefault()
    if (deckId.length == 0){
        walletStart()
        dealCards() 
        fixWallet()
    } else {
        walletStart()
        continueGameDeal()
        fixWallet()
    }
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
                // } else if (e.value == "ACE" && (playerHandValue +11) > 21){
                //     playerHandValues.push(1)
                } else if (e.value == "ACE") {
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

       
          console.log(playerHandValue)
}

//------same as above function but for dealer hand
let dealerHandCounter = function(){
    dealerHand = dealerHand.flat()
    // let firstDraw = document.querySelector("#backOfCard")
    firstDraw.setAttribute("src", "https://i.pinimg.com/originals/25/42/c7/2542c7e8c0dad988ed003eb2218dc268.jpg")
    // let secondDraw = document.querySelector("#secondCard")
    secondDraw.setAttribute("src", dealerHand[1].image)
        if (dealerHand.length === 2){
            dealerHand.forEach(e => {
                if (e.value == "KING" || e.value == "QUEEN" || e.value == "JACK"){
                    dealerHandValues.push(10)
                // } else if (e.value == "ACE" && (dealerHandValue +11) > 21){
                //     dealerHandValues.push(1)
                } else if (e.value == "ACE") {
                    dealerHandValues.push(11)
                } else {
                    dealerHandValues.push(parseInt(e.value))
                }
            })
        } else if (dealerHand.length > 2){
            let lastCard = dealerHand[dealerHand.length -1]
            let cardImage = document.createElement('img')
                cardImage.setAttribute("src", lastCard.image)
                document.querySelector('#drawCards').appendChild(cardImage)
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

let dealCards = function(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => response.json())
    .then(function(data){
        deckId = data.deck_id
    })
    .then(() => {
            fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
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
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        dealerHandCounter()
        
})})}

//----continues to draw from deck without getting a new id

let continueGameDeal = function(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        
        if(cards.remaining < 12){
            alert("sorry, its time to reshuffle the deck!")
            fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
            continueGameDeal()
        } else {
        playerHand.push(cards.cards)
        handCounter()
        }
        })
    .then(() => {
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        dealerHandCounter()
})})}
//------draws 1 card from deck and places in hand, then runse handcounter to get value

let hitCard = function(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(response => response.json())
    .then(cards => {
        playerHand.push(cards.cards)
        handCounter()
        if (playerHandValue > 21){
            setTimeout(function(){ alert("BUST!"); }, 1000);
            setTimeout(function(){ resetBoard() }, 3000);
        } 
    })
    
}

let dealerHit = function(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(response => response.json())
    .then(cards => {
        dealerHand.push(cards.cards)
        dealerHandCounter()
    })
        
}


//-----reset game function
function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}


let resetBoard = function(){
    pairsBet = 0
    suitBet = 0
    standardBet = 0
    playerHand = []
    dealerHand = []
    playerHandValues = []
    dealerHandValues = []
    clearHTML()
}

let clearHTML = function(){
    // let handHTML = document.querySelectorAll("img")
    clearBox("playerHand")
    clearBox("drawCards")
    firstDraw.src = ""
    secondDraw.src = ""
}


//------runs function on button press. 
document.querySelector(".drawCard").addEventListener("click", function(e){
    if(playerHandValue < 21){
        hitCard()
    } 
})


document.querySelector(".finishTurn").addEventListener("click", function(e){
    e.preventDefault()
    smallBets()
    dealerAutomation()
})


//after player presses end turn, the dealer will proceed with their turn drawing until soft 17. 
let dealerAutomation = function(){

    if(dealerHandValue >= 17 && dealerHandValue <= 21){
        if(dealerHandValue > playerHandValue){
            firstDraw.src = dealerHand[0].image
            // alert("Dealer wins, better luck next time!")
            let winTracker = document.createElement('li')
            winTracker.innerHTML = `Player lost ${standardBet} dollars`
            document.querySelector('.winTracker').appendChild(winTracker)
            fixWallet()
            // alert("Dealer wins, better luck next time!")
            setTimeout(function(){ alert("Dealer wins, better luck next time!") }, 1000)
            setTimeout(function(){ resetBoard() }, 3000);
        } else if (playerHandValue > dealerHandValue){
            firstDraw.src = dealerHand[0].image
            // alert("Congrats!, you win!")
            setTimeout(function(){ alert("Congrats!, you win!") }, 1000)
            let winTracker = document.createElement('li')
            winTracker.innerHTML = `Player won ${standardBet*1.5} dollars`
            document.querySelector('.winTracker').appendChild(winTracker)
            wallet = wallet + (standardBet + (standardBet *1.5))
            // console.log(wallet)
            // console.log(standardBet)
            // alert("Congrats!, you win!")
            fixWallet()
            setTimeout(function(){ resetBoard() }, 3000);
        } else if (playerHandValue == dealerHandValue){
            firstDraw.src = dealerHand[0].image
            wallet = wallet + standardBet
            alert("You tied with the dealer")
            setTimeout(function(){ alert("You tied with the dealer") }, 1000)
            let winTracker = document.createElement('li')
            winTracker.innerHTML = `Tie!`
            document.querySelector('.winTracker').appendChild(winTracker)
            fixWallet()
            setTimeout(function(){ resetBoard() }, 3000)
        }
    } else if (dealerHandValue < 17){
        dealerHit()
        setTimeout(function(){ dealerAutomation() }, 1000);
        fixWallet()
    } else if (dealerHandValue >21){
        firstDraw.src = dealerHand[0].image
        // alert("Congrats!, you win!")
        setTimeout(function(){ alert("Congrats!, you win!") }, 1000)
        let winTracker = document.createElement('li')
        winTracker.innerHTML = `Player won ${standardBet*1.5} dollars`
        document.querySelector('.winTracker').appendChild(winTracker)
        wallet = wallet + (standardBet + (standardBet *1.5))
        fixWallet()
        setTimeout(function(){ resetBoard() }, 3000);
    }
    
    // firstDraw.src = dealerHand[0].image
}
// if player wins, they get 3:2 odds back and money is returned to wallet. If dealer wins then player loses money and board is reset. 

let fixWallet = function(){
    document.querySelector("#walletValue").innerText = wallet
    if(wallet <= 0){
        alert("Sorry but it appears you've lost all of your money!")
    }
}

//------double down

let doubleDown = document.querySelector(".doubleDown").addEventListener("click", function(e){
    standardBet += standardBet
    hitCard()
    // dealerAutomation()
    fixWallet()
    setTimeout(function(){ dealerAutomation() }, 3000);
    return standardBet
})


