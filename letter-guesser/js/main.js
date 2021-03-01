let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let exceptReg = /[^\w]/;
let decoder = {};

let messageArr = [`It puts the lotion on its skin...`, `Hello, Clarice.`, `Craptop`, "It's made of people!", "All work and no play makes Johnny a dull boy", `Books are your friends.`];

let ri = 0;

let totalWins = 0;
let totalLosses = 0;
let misses = 0;

let message;
let codedMessage;
let chosen = [];

let time = 0;
let interval = null;

let timer = $('.timer');
let timerBox = $('.timerBox');
let totalWinCount = $('.totalWinCount');
let totalLossCount = $('.totalLossCount');
let dupKey = $('.dupKey');
let messageDiv = $('.message');
let duplicateBox = $('.duplicateBox');
let invalidBox = $('.invalidBox');
let youLose = $('.youLose');
let congrats = $('.congrats');
let missBox = $('.missBox');
let submissionDiv = $('.submissionDiv');
let form = $('.form');
let userPuzzle = $('#userPuzzle');
let sec0 = $('.sec0');
let small = $('small');
let missX = $('.missX');
let more = $('.more')

$(document).ready(function () {
    update(totalWinCount, totalWins);
    update(totalLossCount, totalLosses);
    bodyEvent();
    newPuzzle();
});//end docReady

function bodyEvent() {
    $('body').on('keydown', function (e) {
        duplicateBox.hide();
        invalidBox.hide();

        if (letters.includes(e.key)) {
            if (chosen.includes(e.key)) {//if a duplicate is pressed
                update(dupKey, e.key)
                duplicateBox.show();
            } else {
                if (message.includes(e.key)) {
                    //searches for correct response
                    $('.hiddenLetter:hidden').each(function () {
                        let content = $(this).text();
                        content = content.toLowerCase();
                        //shows the correct letter and updates styles

                        //if correct
                        if (content === e.key) {
                            $(this).show();
                            $(this).parent().siblings().css('color', "#bbb");

                            if ($('.hiddenLetter:hidden').length === 0) {
                                messageArr.splice(ri, 1);
                                totalWins++;
                                clearTime();
                                update(totalWinCount, totalWins);
                                congrats.show();
                                missBox.hide();
                                $('body').off();
                            }
                        }
                    })//end of each()
                } else {
                    misses++;
                    if (misses <= 5) {
                        $(`.missX:eq(${misses - 1})`).css({
                            'color': '#fff',
                            'background': 'red',
                            'opacity': 1
                        });

                        //limit on incorrect guesses
                        if (misses === 5) {
                            totalLosses++;
                            clearTime();
                            update(totalLossCount, totalLosses);
                            youLose.show();
                            messageDiv.hide();
                            $('body').off();
                        }
                    }
                }// end else
            }// end else

            chosen.push(e.key);

        } else {
            invalidBox.show();
        }//end else
    });//end key event
}//end bodyEvent()


$('.tryAgain').on('click', function () {
    update(messageDiv, '');
    missX.css({
        'color': 'red',
        'background': '',
        'opacity': 0.25
    });
    youLose.hide();
    messageDiv.show();
    bodyEvent();
    newPuzzle();
});//end click event

$('.next').on('click', function () {

    if (totalWins % 3 === 0 && totalWins > 0) {
        if (totalWins > 3) {
            more.show();
        }

        update(messageDiv, '');
        congrats.hide();
        timerBox.hide();
        form.show();
    } else {
        update(messageDiv, '');
        missBox.show();
        missX.css({
            'color': 'red',
            'background': '',
            'opacity': 0.25
        });
        congrats.hide();
        bodyEvent();
        newPuzzle();
    }

});//end click event

$('.noThanks').on('click', function () {
    missBox.show();
    missX.css({
        'color': 'red',
        'background': '',
        'opacity': 0.25
    });
    form.hide();
    bodyEvent();
    newPuzzle();
});//end click event

$('.userSubmitBtn').on('click', function () {
    let userPuzzleVal = userPuzzle.val()
    console.log("hello")
    let myReg = /\d/;

    if (userPuzzleVal === '') {
        userPuzzle.css('border', '2px solid crimson');
        userPuzzle.attr('placeholder', 'Required');
    } else {
        if (myReg.test(userPuzzleVal)) {
            userPuzzle.css('border', '2px solid crimson');
            $('.numbersNotAllowed').html(`<small>Numbers are not allowed</small>`);
        } else if (!myReg.test(userPuzzleVal)) {
            messageArr.push(userPuzzleVal);
            update(small, '');
            form.hide();
            submissionDiv.show();
            $('.numbersNotAllowed').html('')
        }
    }
});//end click event

$('.anotherQuestBtn').on('click', function () {
    userPuzzle.val('');
    userPuzzle.css('border', '');
    userPuzzle.attr('placeholder', '');
    submissionDiv.hide();
    form.show();
});//end click

$('.continueBtn').on('click', function () {
    userPuzzle.val('');
    submissionDiv.hide();
    missBox.show();
    missX.css({
        'color': 'red',
        'background': '',
        'opacity': 0.25
    });
    bodyEvent();
    newPuzzle();
});//end click


function newPuzzle() {
    randomIndex();
    let lettersCopy = letters.slice();
    shuffle(lettersCopy);
    message = messageArr[ri];
    decoder = {};
    chosen = [];
    misses = 0;
    timerBox.show();
    sec0.hide();
    timerBox.css('color', 'limegreen');

    time = 30;//initialize timer
    update(timer, time);
    interval = window.setInterval(countDown, 1000);//set interval 1s

    //creates decoder
    for (let i = 0; i < letters.length; i++) {
        decoder[`${letters[i]}`] = lettersCopy[i];
    }//end for loop

    codedMessage = message.split('');

    for (let i = 0; i < codedMessage.length; i++) {
        if (decoder.hasOwnProperty(`${codedMessage[i].toLowerCase()}`)) {
            if (message[i] !== message[i].toLowerCase()) { //if letter is capital
                codedMessage[i] = decoder[`${codedMessage[i].toLowerCase()}`];
                codedMessage[i] = codedMessage[i].toUpperCase();
            } else { //if letter is not capital
                codedMessage[i] = decoder[`${codedMessage[i].toLowerCase()}`];
            }//end if/else
        } else { //if message[i] is something like a space or period, etc.
            codedMessage[i] = codedMessage[i];
        }//end if/else
    };// end for loop

    //Creates array of words(i.e. ["It's", "made", "of", "people"])
    message = message.split(' ');
    codedMessage = codedMessage.join('');
    codedMessage = codedMessage.split(' ');

    //populates the html with the coded and decoded message - decoded message letters are hidden
    for (let i = 0; i < message.length; i++) {
        //wrap each word
        messageDiv.append(`<div class="wordDiv"></div>`);
        message[i] = message[i].split('');

        //wrap each letter
        for (let j = 0; j < message[i].length; j++) {
            if (exceptReg.test(message[i][j]) === true) {//if it is not a letter
                $(`.wordDiv:eq(${i})`).append(`
            <div>
                <div class="letterDiv" style="color: #bbb">${codedMessage[i][j]}</div> 
                
                <div class="hiddenContainer">
                    <div class="letterDiv hiddenLetter">${message[i][j]}</div>
                </div>
                
            </div>`);
            } else {//if it is a letter
                $(`.wordDiv:eq(${i})`).append(`
            <div class="letterWrap">
                <div class="letterDiv">${codedMessage[i][j]}</div> 
            
                <div class="hiddenContainer">
                    <div class="letterDiv hiddenLetter">${message[i][j]}</div>
                </div>
                
                <div>__</div>
            </div>`
                );//end append
            }//end else
        };//end inner for loop 
    };//end outer for loop

    $('.hiddenLetter').each(function () {
        if (exceptReg.test($(this).text())) {
            $(this).show();
        }//end if
    });//end each function

    //joins message back into a single lowercase string so message.includes() can be used in key even
    for (let i = 0; i < message.length; i++) {
        message[i] = message[i].join('');
    };
    message = message.join('');
    message = message.toLowerCase();
}//end of newPuzzle() function

function randomIndex() {
    ri = Math.floor(Math.random() * messageArr.length);
}//end randomInd() function

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function update(a, b) {
    a.html(b);
};//end of update() function

function countDown() {
    time--;//subtract 1 from time
    update(timer, time);//update the html clock (decreased 1s)

    if (time >= 10) {
        timerBox.css('color', 'limegreen');
    }

    if (time < 10) {
        sec0.show();
        timerBox.css('color', 'red');
    }

    if (time <= 0) {
        clearTime();
        totalLosses++;
        update($('.totalLossCount'), totalLosses);
        duplicateBox.hide();
        invalidBox.hide();
        update(messageDiv, '');
        youLose.show();
        $('body').off();

    }
};//end of countDown() function

function clearTime() {
    window.clearInterval(interval);//stop the timer
};//end of clearTime() function