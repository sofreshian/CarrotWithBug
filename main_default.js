// global
const CARROT_SIZE = 120;
const CARROT_COUNT = 5;
const BUG_SIZE = 5;
const GAME_DURATION_SEC = 5;

// Node
const $field = document.querySelector('.game__field');
const $fieldRect = $field.getBoundingClientRect();
const $gameBtn = document.querySelector('.game__button');
const $gameTimer = document.querySelector('.game__timer');
const $gameScore = document.querySelector('.game__score');
const $popUp = document.querySelector('.pop-up');
const $popUpRefresh = document.querySelector('.pop-up__refresh');
const $popUpMessage = document.querySelector('.pop-up__message');

// sound
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const alertSound = new Audio('./sound/alert.wav');
const winSound = new Audio('./sound/game_win.mp3');


let started = false;
let score = 0;
let timer = undefined;

// 필드에서 클릭되면 onFieldClick 이벤트 호출
$field.addEventListener('click', onFieldClick);

// 게임 플레이 버튼
$gameBtn.addEventListener('click', () => {
  if(started) {
    stopGame();
  } else {
    startGame();
  }
});

// 게임 리프레시 버튼
$popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
})

// 게임 시작 함수
function startGame() {
  score = 0;
  started = true;
  initGame();
  showStopButton();
  showTimerandScore();
  startGameTimer()
  playSound(bgSound);
}

// 게임 중지 함수
function stopGame() {
  started = false;
  stopGameTimer();
  // hideGameButton();
  stopSound(bgSound);
  playSound(alertSound);
  showPopUpWithText('REPLAY☝🏼');
  showPlayButton();
}

// finishGame 함수
function finishGame(win) {
  started = false;
  // hideGameButton();
  stopGameTimer();
  showPopUpWithText(win ? 'YOU WON 👍🏼' : 'YOU LOST 👎🏼');
  stopSound(bgSound);
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
}

// 게임(play)버튼을 누르면 중지(pause)버튼으로 변경되는 함수
function showStopButton() {
  const icon = $gameBtn.querySelector('.fas');
  icon.classList.remove('fa-play');
  icon.classList.add('fa-stop');
}

// 게임(pause)버튼을 누르면 플레이(play)버튼으로 변경되는 함수 (향후 팝업이 사라지고 게임이 재개되는 부분을 마련 해야함)
function showPlayButton() {
  const icon = $gameBtn.querySelector('.fas');
  icon.classList.remove('fa-stop');
  icon.classList.add('fa-play');
}

// 게임 시작시 타이머와 스코어 보여주는 함수
function showTimerandScore() {
  $gameTimer.style.visibility = 'visible';
  $gameScore.style.visibility = 'visible';
}

// 게임이 중지되었을 경우 플레이버튼 제거 함수
function hideGameButton() {
  $gameBtn.style.visibility = 'hidden';
}

// 게임 타이머 설정  
function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    } updateTimerText(--remainingTimeSec);
  }, 1000);
}

// 타이머를 중지하는 함수
function stopGameTimer() {
  clearInterval(timer);
}

// 타이머를 출력하는 함수
function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  $gameTimer.innerText = `${minutes} : ${seconds}`;
}

function showPopUpWithText(text) {
  $popUpMessage.innerText = text;
  $popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  $popUp.classList.add('pop-up--hide');
}

// 벌레와 당근을 생성한 뒤 field에 추가해 준다. 
function initGame() {
  $field.innerHTML = '';
  $gameScore.innerText = CARROT_COUNT;
  addItem('carrot', 5, './img/carrot.png');
  addItem('bug', 5, './img/bug.png');
}

// 오디오 함수(재생)
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// 오디오 함수(중지)
function stopSound(sound) {
  sound.pause();
}


// 클릭이 발생하면 onFieldClick 함수 호출
function onFieldClick(event) {
  if (!started) {
    return;
  } 
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreboard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    } 
  } else if (target.matches('.bug')) {
    stopGameTimer();
    finishGame(false);
  }
}

// 스코어보드 업데이트 함수
function updateScoreboard() {
  $gameScore.innerText = CARROT_COUNT - score;
}


// 랜덤 함수(아이템의 분배 공간 파악을 위한)
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// 아이템 추가 함수
function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = $fieldRect.width - CARROT_SIZE;
  const y2 = $fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const $item = document.createElement('img');
    $item.setAttribute('class', className);
    $item.setAttribute('src', imgPath);
    $item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    $item.style.left = `${x}px`;
    $item.style.top = `${y}px`;
    $field.appendChild($item);
  }
}



