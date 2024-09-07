const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', function () {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const text = "Selamat Datang di VERDIYA";
    const element = document.querySelector('.banner h1');
    const speed = 100; // Typing speed in milliseconds
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                element.textContent = ''; // Clear text
                index = 0; // Reset index
                type(); // Start typing again
            }, 2000); // Delay before restart
        }
    }

    type(); // Start typing effect
});

// Fungsi untuk membuka popup
function openPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

// Fungsi untuk menutup popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-btn');
const trashContainer = document.querySelector('.trash-container');
const bins = document.querySelectorAll('.bin');

let score = 0;
let gameInterval;
const trashTypes = [
    { id: 'plastic-trash', name: 'Plastik', type: 'recycling' },
    { id: 'paper-trash', name: 'Kertas', type: 'recycling' },
    { id: 'food-trash', name: 'Makanan', type: 'trash' },
    { id: 'glass-trash', name: 'Kaca', type: 'recycling' }
];

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

function endGame() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function restartGame() {
    gameOverElement.classList.add('hidden');
    score = 0;
    updateScore(0);
    startGame();
}

function createTrashItem() {
    const randomIndex = Math.floor(Math.random() * trashTypes.length);
    const trashType = trashTypes[randomIndex];
    const trash = document.createElement('div');
    trash.className = 'trash';
    trash.id = trashType.id;
    trash.dataset.type = trashType.type;
    trash.textContent = trashType.name;
    trash.draggable = true;
    trashContainer.appendChild(trash);

    // Add event listeners for drag events
    trash.addEventListener('dragstart', handleDragStart);
    trash.addEventListener('dragend', handleDragEnd);

    // Add event listeners for touch events
    trash.addEventListener('touchstart', handleTouchStart);
    trash.addEventListener('touchend', handleTouchEnd);
}

function startGame() {
    gameInterval = setInterval(() => {
        if (document.querySelectorAll('.trash').length < 3) {
            createTrashItem();
        }
    }, 2000);

    // Add event listeners to bins
    bins.forEach(bin => {
        bin.addEventListener('drop', handleDrop);
        bin.addEventListener('dragover', handleDragOver);
        bin.addEventListener('touchstart', handleTouchStartBin);
        bin.addEventListener('touchend', handleTouchEndBin);
    });
}

// Handle drag start
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
}

// Handle drag end
function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

// Handle touch start
function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const draggedElement = document.getElementById(event.target.id);
    draggedElement.classList.add('dragging');
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = `${touch.clientX}px`;
    draggedElement.style.top = `${touch.clientY}px`;

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        draggedElement.style.left = `${touch.clientX}px`;
        draggedElement.style.top = `${touch.clientY}px`;
    });

    document.addEventListener('touchend', (e) => {
        draggedElement.classList.remove('dragging');
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
    });
}

// Handle touch end
function handleTouchEnd(event) {
    event.preventDefault();
    // Determine which bin the trash was dropped in
    const touchedElement = event.target;
    if (touchedElement.classList.contains('bin')) {
        handleDrop({
            target: touchedElement,
            dataTransfer: {
                getData: () => event.target.id
            }
        });
    }
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const droppedElement = document.getElementById(id);
    const binType = event.target.id === 'recycling-bin' ? 'recycling' : 'trash';

    if (droppedElement.dataset.type === binType) {
        updateScore(10);
        droppedElement.remove();
    } else {
        updateScore(-5);
    }

    // End game if no items are left
    if (document.querySelectorAll('.trash').length === 0) {
        endGame();
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
}

// Handle touch start for bins
function handleTouchStartBin(event) {
    event.preventDefault();
    const touch = event.touches[0];
    event.target.style.position = 'absolute';
    event.target.style.left = `${touch.clientX}px`;
    event.target.style.top = `${touch.clientY}px`;
}

// Handle touch end for bins
function handleTouchEndBin(event) {
    event.preventDefault();
    const bin = event.target;
    handleDrop({
        target: bin,
        dataTransfer: {
            getData: () => ''
        }
    });
    bin.style.position = '';
    bin.style.left = '';
    bin.style.top = '';
}

// Start the game
startGame();

// Restart game on button click
restartButton.addEventListener('click', restartGame);
