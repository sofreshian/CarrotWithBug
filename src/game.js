import * as sound from './sound.js';
import { Field, ItemType } from './field.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});


// Builder pattern
export class GameBuilder {
  WithgameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  WithCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  WithBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    // console.log(this);
    return new Game(
      this.gameDuration,
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.$gameTimer = document.querySelector('.game__timer');
    this.$gameScore = document.querySelector('.game__score');
    this.$gameBtn = document.querySelector('.game__button');

    this.$gameBtn.addEventListener('click', () => {
      if(this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

    setGameStopListener(onGameStop) {
      this.onGameStop = onGameStop;
    }

    start() {
      this.score = 0;
      this.started = true;
      this.initGame();
      this.showStopButton();
      this.showTimerandScore();
      this.startGameTimer()
      sound.playBackground();
    }

    stop(reason) {
      this.started = false;
      this.stopGameTimer();
      // this.hideGameButton();
      sound.stopBackground();
      this.showPlayButton();
      this.onGameStop && this.onGameStop(reason);
    }

    onItemClick = item => {
      if (!this.started) {
        return;
      } 
      if (item === 'carrot') {
        this.score++;
        this.updateScoreboard();
        if (this.score === this.carrotCount) {
          this.stop(Reason.win);
        } 
      } else if (item === 'bug') {
        this.stop(Reason.lose);
      }
    };

        // 게임(play)버튼을 누르면 중지(pause)버튼으로 변경되는 함수
    showStopButton() {
      const icon = this.$gameBtn.querySelector('.fas');
      icon.classList.remove('fa-play');
      icon.classList.add('fa-stop');
    }

    // 게임(pause)버튼을 누르면 플레이(play)버튼으로 변경되는 함수 (향후 팝업이 사라지고 게임이 재개되는 부분을 마련 해야함)
    showPlayButton() {
      const icon = this.$gameBtn.querySelector('.fas');
      icon.classList.remove('fa-stop');
      icon.classList.add('fa-play');
    }

    // 게임 시작시 타이머와 스코어 보여주는 함수
    showTimerandScore() {
      this.$gameTimer.style.visibility = 'visible';
      this.$gameScore.style.visibility = 'visible';
    }

    // 게임이 중지되었을 경우 플레이버튼 제거 함수
    hideGameButton() {
      this.$gameBtn.style.visibility = 'hidden';
    }

    // 게임 타이머 설정  
    startGameTimer() {
      let remainingTimeSec = this.gameDuration;
      this.updateTimerText(remainingTimeSec);
      this.timer = setInterval(() => {
        if (remainingTimeSec <= 0) {
          clearInterval(this.timer);
          this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
          return;
        } this.updateTimerText(--remainingTimeSec);
      }, 1000);
    }

    // 타이머를 중지하는 함수
    stopGameTimer() {
      clearInterval(this.timer);
    }

    // 타이머를 출력하는 함수
    updateTimerText(time) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      this.$gameTimer.innerText = `${minutes} : ${seconds}`;
    }

    // 벌레와 당근을 생성한 뒤 field에 추가해 준다. 
    initGame() {
      this.$gameScore.innerText = this.carrotCount;
      this.gameField.init();
    }

    // 스코어보드 업데이트 함수
    updateScoreboard() {
      this.$gameScore.innerText = this.carrotCount - this.score;
    }
  
}