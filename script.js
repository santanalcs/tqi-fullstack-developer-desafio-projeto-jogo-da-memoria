
const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

//variáveis cronômetro
let hh = 0;
let mm = 0;
let ss = 0;

let cron;
let horas;
let format;
let minScore;
let arrayScore = [];
let time = 1000;
let starts = 0;
let running = 0;
//--------- XXX ------
//funções cronômetro -
function start() {
    cron = setInterval(() => {timer(); }, time);
}

function stop() {
    
    arrayScore.push(parseInt(format.replace(/:/g, '')));

    minScore = Math.min(...arrayScore).toString(); // ... envia os itens do array um a um para função Math.min definir qual o menor valor.
    let recorde = score(minScore);

    function score(score) {
        if(minScore < 10){
            return "00:0" + score;
        }
        if(minScore < 99){
            return "00:" + score;
        }
        if(minScore < 999){
            let mm = "0" + score.substr(0, 1);
            let ss = score.substr(1, 2)
            return mm + ":" + ss;
        } else {
            let mm = score.substr(0, 2);
            let ss = score.substr(2)
            return mm + ":" + ss;
        }

    }

    clearInterval(cron);
    //hh = 0;
    mm = 0;
    ss = 0;

    document.getElementById('countdown').innerText = "00:00";
    document.getElementById('first-time').innerText = format;
    document.getElementById('min-time').innerText = recorde;
}

function timer () {
    ss++;
    if(ss == 60) {
        mm++;
        ss = 0;

        if(mm == 60) {
            //hh++;
            mm = 0;
            ss = 0;
        }
    }
    //format = (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
    format = (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
    document.getElementById('countdown').innerText = format;
}
//--------- XXX ------

//função para virar carta. Modificada para inciar contagem do tempo no momento em que a primeira carta é virada.
function flipCard() {
    if(lockBoard) return;
    if(this === firstCard) return;

    this.classList.add('flip');
    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
//Inicia contagem do tempo
        if(starts == 0){
            start();
            starts = 1;
        };
//---------- X ------- X -----------
        return;
    }
    
    secondCard = this;
    hasFlippedCard = false;
    checkForMatch();
}

//função que checa se as cartas são iguais. Modificada para zerar o tempo
function checkForMatch() {
    if(firstCard.dataset.card === secondCard.dataset.card) {
        disableCards();
//Monitora os acertos, parando o tempo quando o jogo é finalizado.     
        running = running + 1;
        if(running == 6) {
            stop();
            starts = 0;
            restart();
        }
//---------- X ------- X ----------- X --------- X ------------
        return;
    }

    unflipCards();
}

//função que desabilita as cartas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

//funcão que desvira as cartas
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

//função que reseta o tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//função que embaralha as cartas
(function shuffle() {
    cards.forEach((card) => {
        let ramdomPosition = Math.floor(Math.random() * 12);
        card.style.order = ramdomPosition;
    })
})();

//função que reinicia o jogo sem zerar os tempos do jogador
function restart() {
    cards.forEach((card) => {
        let ramdomPosition = Math.floor(Math.random() * 12);
        setTimeout(() => {
            card.classList.remove('flip');
        }, 2000);

        setTimeout(() => {
            card.style.order = ramdomPosition;
        }, 2300);

        card.addEventListener('click', flipCard)
    });
    
   resetBoard();
   running = 0;
}


//adiciona evento de clique na carta
cards.forEach((card) => {
    card.addEventListener('click', flipCard)
});