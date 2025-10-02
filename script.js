
let state = 'ready'; 
let startTime = null;
let timer = null;
let attempts = [];


const testArea = document.getElementById('testArea');
const mainText = document.getElementById('mainText');
const subText = document.getElementById('subText');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const statsPanel = document.getElementById('statsPanel');
const attemptsCount = document.getElementById('attemptsCount');
const bestTime = document.getElementById('bestTime');
const avgTime = document.getElementById('avgTime');
const attemptsList = document.getElementById('attemptsList');
const clearBtn = document.getElementById('clearBtn');


const emoji = document.querySelector('.emoji');


function startTest() {
    state = 'waiting';
    updateUI();
    
    
    const delay = Math.random() * 3000 + 2000;
    
    timer = setTimeout(() => {
        startTime = Date.now();
        state = 'click';
        updateUI();
    }, delay);
}


function handleClick() {
    if (state === 'ready') {
        startTest();
    } else if (state === 'waiting') {
        clearTimeout(timer);
        state = 'results';
        showResults('Too early!');
    } else if (state === 'click') {
        const endTime = Date.now();
        const reactionTime = endTime - startTime;
        attempts.push(reactionTime);
        state = 'results';
        showResults(reactionTime);
        updateStats();
    }
}


function updateUI() {
    
    testArea.classList.remove('ready', 'waiting', 'click', 'results');
    
    
    testArea.classList.add(state);
    
    
    if (state === 'ready') {
        emoji.textContent = '👆';
        mainText.textContent = 'Click to Start';
        subText.textContent = 'Get ready to test your reflexes';
        tryAgainBtn.style.display = 'none';
    } else if (state === 'waiting') {
        emoji.textContent = '⏳';
        mainText.textContent = 'Wait for Green...';
        subText.textContent = "Don't click yet!";
        tryAgainBtn.style.display = 'none';
    } else if (state === 'click') {
        emoji.textContent = '⚡';
        mainText.textContent = 'CLICK NOW!';
        subText.textContent = '';
        tryAgainBtn.style.display = 'none';
    }
}


function showResults(result) {
    if (result === 'Too early!') {
        emoji.textContent = '❌';
        mainText.textContent = 'Too Early!';
        subText.textContent = 'Wait for the green screen!';
    } else {
        emoji.textContent = '🎯';
        mainText.textContent = `${result}ms`;
        subText.textContent = 'Great job!';
    }
    
    tryAgainBtn.style.display = 'inline-block';
}


function reset() {
    state = 'ready';
    updateUI();
}


function updateStats() {
    if (attempts.length === 0) {
        statsPanel.style.display = 'none';
        return;
    }
    
    statsPanel.style.display = 'block';
    
    
    attemptsCount.textContent = attempts.length;
    
    
    const best = Math.min(...attempts);
    bestTime.textContent = `${best}ms`;
    
    
    const sum = attempts.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / attempts.length);
    avgTime.textContent = `${avg}ms`;
    
    
    updateAttemptsList();
}

function updateAttemptsList() {
    attemptsList.innerHTML = '';
    
    const reversedAttempts = [...attempts].reverse();
    
    reversedAttempts.forEach((time, index) => {
        const attemptNum = attempts.length - index;
        const item = document.createElement('div');
        item.className = 'attempt-item';
        item.innerHTML = `
            <span>Attempt ${attemptNum}</span>
            <span class="time">${time}ms</span>
        `;
        attemptsList.appendChild(item);
    });
}

function clearHistory() {
    attempts = [];
    statsPanel.style.display = 'none';
}

testArea.addEventListener('click', handleClick);
tryAgainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    reset();
});
clearBtn.addEventListener('click', clearHistory);

// Initialize
updateUI();