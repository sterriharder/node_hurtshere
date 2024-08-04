const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const timeElapsedDisplay = document.getElementById('time-elapsed');
const dungImageUrl = 'dung.png';
const playerSpeed = 10;
let playerX = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
let dungInfos = [];
let dungSpeed = 5;
let timeElapsed = 0;
let gameInterval;
let difficultyInterval;

// 키보드 이벤트
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerX > 0) {
        playerX -= playerSpeed;
    } else if (e.key === 'ArrowRight' && playerX < gameContainer.offsetWidth - player.offsetWidth) {
        playerX += playerSpeed;
    }
});

// 터치 이벤트
let touchStartX = null;
gameContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

gameContainer.addEventListener('touchmove', (e) => {
    if (touchStartX) {
        const touchX = e.touches[0].clientX;
        const diffX = touchX - touchStartX;
        touchStartX = touchX;

        playerX += diffX;
        if (playerX < 0) {
            playerX = 0;
        } else if (playerX > gameContainer.offsetWidth - player.offsetWidth) {
            playerX = gameContainer.offsetWidth - player.offsetWidth;
        }
        player.style.left = playerX + 'px';
    }
});

gameContainer.addEventListener('touchend', () => {
    touchStartX = null;
});

function createDung() {
    const dungElement = document.createElement('div');
    dungElement.classList.add('dung');
    dungElement.style.backgroundImage = `url(${dungImageUrl})`;
    dungElement.style.position = 'absolute';
    dungElement.style.width = '50px';
    dungElement.style.height = '50px';
    dungElement.style.top = '0px';
    dungElement.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;

    dungInfos.push({
        element: dungElement,
        speed: dungSpeed,
        xPos: dungElement.style.left,
        yPos: 0
    });

    gameContainer.appendChild(dungElement);
}

function updateDungPositions() {
    dungInfos.forEach(dungInfo => {
        dungInfo.yPos += dungInfo.speed;
        dungInfo.element.style.top = `${dungInfo.yPos}px`;

        if (dungInfo.yPos > gameContainer.offsetHeight) {
            dungInfo.yPos = 0;
            dungInfo.xPos = Math.random() * (gameContainer.offsetWidth - 50);
            dungInfo.element.style.left = `${dungInfo.xPos}px`;
        }

        const dungRect = dungInfo.element.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            dungRect.bottom > playerRect.top &&
            dungRect.top < playerRect.bottom &&
            dungRect.right > playerRect.left &&
            dungRect.left < playerRect.right
        ) {
            gameOver();
        }
    });
}

function updateGame() {
    player.style.left = playerX + 'px';
    updateDungPositions();
    timeElapsed += 100;
    timeElapsedDisplay.innerText = `시간: ${(timeElapsed / 1000).toFixed(3)}초`; // 초 단위로 변환
}

function increaseDifficulty() {
    dungSpeed += 0.5;
    createDung();
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(difficultyInterval);
    alert(`게임 오버! 당신의 점수는 ${(timeElapsed / 1000).toFixed(3)}초 입니다.`);
    location.reload();
}

function startGame() {
    createDung();
    gameInterval = setInterval(updateGame, 100);
    difficultyInterval = setInterval(increaseDifficulty, 5000);
}

startGame();