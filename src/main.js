import PopUp from './popup.js';
import {  GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  game.start();
});


const game = new GameBuilder()
  .WithgameDuration(5)
  .WithCarrotCount(3)
  .WithBugCount(3)
  .build();

game.setGameStopListener(reason => {
  // console.log(reason);
  let message;
  switch(reason) {
    case Reason.cancel:
      message = 'Go For It Again? ☝🏼';
      sound.playAlert();
      break;
    case Reason.win:
      message = 'YOU WON 👍🏼';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'YOU LOST 👎🏼';
      sound.playBug();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
})




