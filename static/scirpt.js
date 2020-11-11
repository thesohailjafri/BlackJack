let bjgame = {
    'msg': { 'hit': "Click stand to stop", 'stand': "Click deal to start new round", 'reset': "Click hit to start" },
    'status': { 'win': 0, 'lost': 0, 'tie': 0, 'total': 0 },
    'scoreboard': { 'win': '#win', 'lost': '#lost', 'tie': '#tie', 'total': '#total' },
    'user': { 'scorespan': '#user-span', 'div': '#user-container', 'score': 0 },
    'bot': { 'scorespan': '#bot-span', 'div': '#bot-container', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'Q', 'K', 'J'],
    'cardsValues': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': [1, 11], 'Q': 10, 'K': 10, 'J': 10 },
};
//dict variables
const c_msg = bjgame['msg'];
const c_user = bjgame['user'];
const c_bot = bjgame['bot'];
const c_status = bjgame['status'];
const c_cards = bjgame['cards'];
const c_values = bjgame['cardsValues'];
const c_scoreboard = bjgame['scoreboard'];
//msg variable
const msg = '#play-message';
const msg_result = '#result-message';
//booleans for btn
let hitbtn = new Boolean(true);
let standbtn = new Boolean(false);
let dealbtn = new Boolean(false);
//sound variables
const hitsound = new Audio('static/audios/hit.mp3');
const standsound = new Audio('static/audios/stand.mp3');
const dealsound = new Audio('static/audios/deal.mp3');
const gameover = new Audio('static/audios/gameover.mp3');
const winsound = new Audio('static/audios/win.mp3');
const lostsound = new Audio('static/audios/lost.mp3');
const tiesound = new Audio('static/audios/tie.mp3');
//hit-stand-deal event listener
document.querySelector('#btn-hit').addEventListener('click', hitevent);
document.querySelector('#btn-stand').addEventListener('click', standevent);
document.querySelector('#btn-deal').addEventListener('click', resetevent);
//hit event
function hitevent() {
    if (hitbtn == true) {
        hitsound.play();
        let user = c_user;
        let values = c_values;
        let card = randomCard();
        showCard(card, user);
        makeScore(card, user, values)
        showScore(user);
        hitMessage();
        standbtn = true;
    }
}
//stand event
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function standevent() {
    if (standbtn == true) {
        let bot = c_bot;
        let user = c_user;
        let values = c_values;
        let status = c_status;



        while (bot['score'] <= 15) {
            hitsound.play();
            let card = randomCard();
            showCard(card, bot);
            makeScore(card, bot, values)
            showScore(bot);
            await sleep(800);
        }
        let winner = updateScoreboard(user, bot, status);
        showWinner(winner);
        totalCount(status);
        standMessage();
        hitbtn = false;
    }
}
//reset event
function resetevent() {
    if (hitbtn == false && standbtn == true) {
        dealsound.play();
        let user = c_user;
        let bot = c_bot;
        let botImg = document.querySelector(c_bot['div']).querySelectorAll('img');
        let userImg = document.querySelector(c_user['div']).querySelectorAll('img');
        removeCard(botImg);
        removeCard(userImg);
        resetSpan(user);
        resetSpan(bot);
        hitbtn = true;
        standbtn = false;
        resetMessage();
    }
}

/////
//hitevent functions

function randomCard() {
    let number = Math.floor(Math.random() * 13);
    return bjgame['cards'][number];
}

function showCard(f_card, f_user) {
    if (f_user['score'] <= 21) {
        let cardImg = document.createElement('img');
        cardImg.src = `static/images/${f_card}.png`;
        document.querySelector(f_user['div']).appendChild(cardImg);
    }
}

function makeScore(f_card, f_user, f_values) {
    if (f_user['score'] <= 21) {
        if (f_card == 'A') {
            if (f_user['score'] + f_values[f_card][1] <= 21) {
                f_user['score'] += f_values[f_card][1];
            } else {
                f_user['score'] += f_values[f_card][0];
            }
        } else {
            f_user['score'] += f_values[f_card];
        }
    }
    return f_user['score'];
}

function showScore(f_user) {
    if (f_user['score'] <= 21) {
        document.querySelector(f_user['scorespan']).textContent = f_user['score'];
    } else {
        standsound.play();
        document.querySelector(f_user['scorespan']).textContent = "BUSTED";
        document.querySelector(f_user['scorespan']).style.color = "black";
    }
}

function hitMessage() {
    document.querySelector(msg).textContent = c_msg['hit'];
}
/////

/////
//standevent function
function updateScoreboard(f_user, f_bot, f_status) {
    let winner;
    if (f_user['score'] <= 21 && f_bot['score'] <= 21) {
        if (f_user['score'] === f_bot['score']) {
            winner = "none";
            document.querySelector(c_scoreboard['tie']).textContent = f_status['tie'] += 1;

        } else if (f_user['score'] < f_bot['score']) {
            winner = "bot";
            document.querySelector(c_scoreboard['lost']).textContent = f_status['lost'] += 1;

        } else if (f_user['score'] > f_bot['score']) {
            winner = "user";
            document.querySelector(c_scoreboard['win']).textContent = f_status['win'] += 1;
        }

    } else if (f_user['score'] > 21 || f_bot['score'] > 21) {
        if (f_user['score'] > 21 && f_bot['score'] > 21) {
            winner = "none";
            document.querySelector(c_scoreboard['tie']).textContent = f_status['tie'] += 1;

        } else if (f_user['score'] > 21) {
            winner = "bot";
            document.querySelector(c_scoreboard['lost']).textContent = f_status['lost'] += 1;

        } else if (f_bot['score'] > 21) {
            winner = "user";
            document.querySelector(c_scoreboard['win']).textContent = f_status['win'] += 1;
        }
    }

    return winner;
}

function showWinner(winner) {
    if (winner == "user") {
        winsound.play();
        document.querySelector(msg_result).textContent = "You Won";
    } else if (winner == "bot") {
        lostsound.play();
        document.querySelector(msg_result).textContent = "You lost";

    } else if (winner == "none") {
        tiesound.play();
        document.querySelector(msg_result).textContent = "Its a tie";
    }

}

function totalCount(f_status) {
    f_status['total'] = c_status['win'] + c_status['lost'] + c_status['tie'];
    document.querySelector(c_scoreboard['total']).textContent = f_status['total'];

}

function standMessage() {
    document.querySelector(msg).textContent = c_msg['stand'];

}

/////

/////
//resetevent functions'
function removeCard(player) {
    for (i = 0; i < player.length; i++) {
        player[i].remove();
    }
}

function resetSpan(player) {
    player['score'] = 0;
    document.querySelector(player['scorespan']).textContent = "0";
    document.querySelector(player['scorespan']).style.color = "white";
}

function resetMessage() {
    document.querySelector(msg).textContent = c_msg['reset'];
}

/////