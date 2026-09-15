const player =
    document.getElementById("player");

const objects =
    document.getElementById("objects");

const scoreText =
    document.getElementById("score");

const coinsText =
    document.getElementById("coins");

const livesText =
    document.getElementById("lives");

const speedText =
    document.getElementById("speed");

const startScreen =
    document.getElementById("startScreen");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const finalCoins =
    document.getElementById("finalCoins");


/* =====================
   GAME DATA
===================== */

let lane = 1;

let score = 0;
let coins = 0;
let lives = 3;

let speed = 5;

let running = false;
let jumping = false;

let spawnInterval;
let scoreInterval;


/* posisi 3 jalur */

const lanes = [
    "33%",
    "50%",
    "67%"
];


/* =====================
   MOVE LEFT
===================== */

function moveLeft() {

    if (!running) return;

    if (lane > 0) {

        lane--;

        player.style.left =
            lanes[lane];
    }
}


/* =====================
   MOVE RIGHT
===================== */

function moveRight() {

    if (!running) return;

    if (lane < 2) {

        lane++;

        player.style.left =
            lanes[lane];
    }
}


/* =====================
   JUMP
===================== */

function jump() {

    if (!running) return;

    if (jumping) return;

    jumping = true;

    player.classList.add("jump");

    setTimeout(() => {

        player.classList.remove("jump");

        jumping = false;

    }, 600);
}


/* =====================
   TOMBOL
===================== */

document
    .getElementById("leftBtn")
    .addEventListener(
        "click",
        moveLeft
    );

document
    .getElementById("rightBtn")
    .addEventListener(
        "click",
        moveRight
    );

document
    .getElementById("jumpBtn")
    .addEventListener(
        "click",
        jump
    );


/* =====================
   CREATE OBJECT
===================== */

function createObject() {

    if (!running) return;

    const object =
        document.createElement("div");

    const objectLane =
        Math.floor(
            Math.random() * 3
        );

    const isCoin =
        Math.random() < .55;


    object.classList.add(
        "object"
    );


    /* COIN */

    if (isCoin) {

        object.classList.add(
            "coin"
        );

        object.textContent = "🪙";

    }

    /* OBSTACLE */

    else {

        object.classList.add(
            "obstacle"
        );

        const obstacles = [
            "🚧",
            "🪨",
            "🔥"
        ];

        object.textContent =
            obstacles[
                Math.floor(
                    Math.random()
                    * obstacles.length
                )
            ];
    }


    object.style.left =
        lanes[objectLane];

    object.style.top =
        "-80px";


    objects.appendChild(object);


    let position = -80;


    const fall =
        setInterval(() => {

            if (!running) {

                clearInterval(fall);

                return;
            }


            position += speed;

            object.style.top =
                position + "px";


            collisionCheck(
                object,
                fall
            );


            if (
                position >
                window.innerHeight
            ) {

                object.remove();

                clearInterval(fall);
            }

        }, 20);
}


/* =====================
   COLLISION
===================== */

function collisionCheck(
    object,
    interval
) {

    const p =
        player.getBoundingClientRect();

    const o =
        object.getBoundingClientRect();


    const collision =

        p.left < o.right &&
        p.right > o.left &&
        p.top < o.bottom &&
        p.bottom > o.top;


    if (!collision) return;


    /* COIN */

    if (
        object.classList
        .contains("coin")
    ) {

        coins += 1;

        score += 50;

        coinsText.textContent =
            coins;

        scoreText.textContent =
            score;

        object.remove();

        clearInterval(interval);

        return;
    }


    /* OBSTACLE */

    if (jumping) return;


    lives--;

    livesText.textContent =
        lives;


    player.classList.add(
        "hit"
    );


    setTimeout(() => {

        player.classList.remove(
            "hit"
        );

    }, 400);


    object.remove();

    clearInterval(interval);


    if (lives <= 0) {

        endGame();
    }
}


/* =====================
   SCORE
===================== */

function updateScore() {

    if (!running) return;

    score++;

    scoreText.textContent =
        score;


    /* tambah kecepatan */

    if (
        score % 500 === 0
    ) {

        speed += .7;

        speedText.textContent =
            speed.toFixed(1);
    }
}


/* =====================
   START GAME
===================== */

function startGame() {

    score = 0;
    coins = 0;
    lives = 3;

    speed = 5;

    lane = 1;

    jumping = false;


    scoreText.textContent =
        "0";

    coinsText.textContent =
        "0";

    livesText.textContent =
        "3";

    speedText.textContent =
        "1";


    player.style.left =
        lanes[1];


    objects.innerHTML = "";


    startScreen.classList.add(
        "hidden"
    );

    gameOver.classList.add(
        "hidden"
    );


    running = true;


    spawnInterval =
        setInterval(
            createObject,
            850
        );


    scoreInterval =
        setInterval(
            updateScore,
            100
        );
}


/* =====================
   GAME OVER
===================== */

function endGame() {

    running = false;


    clearInterval(
        spawnInterval
    );

    clearInterval(
        scoreInterval
    );


    finalScore.textContent =
        score;

    finalCoins.textContent =
        coins;


    gameOver.classList.remove(
        "hidden"
    );
}


/* =====================
   START / RESTART
===================== */

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        startGame
    );

document
    .getElementById("restartBtn")
    .addEventListener(
        "click",
        startGame
    );
