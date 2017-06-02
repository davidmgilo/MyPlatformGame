/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init (widt, heigh) {
    this.gamewidth = widt
    this.gameheight = heigh
    this.game.scale.setGameSize(this.gamewidth,this.gameheight)
    this.stage.backgroundColor = '#000000'
    this.titleText = game.make.text(this.gamewidth/2, this.gameheight/5, "Game Over", {
      font: 'bold 40pt Arial',
      fill: '#FFFFFF',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.game.gameOptions.musicPlayer.stop()
  }
  preload () {
    this.optionCount = 0;
  }

  create () {
    game.add.existing(this.titleText);
    game.stage.disableVisibilityChange = true;
    this.addOptions()
  }

  update () {
  }

  addOptions () {
    var that = this
    this.addMenuOption(this.game.gameOptions.lives <= 0 ? 'You lose' : 'You win', function(){

    }, this.game.gameOptions.lives <= 0 ? 'red' : 'green')
    this.addMenuOption('Play Again', function (target) {
      that.game.state.start('Game', true, false, that.gamewidth, that.gameheight)
    });
    this.addMenuOption("Main Menu", function (target) {
      that.game.state.start('Menu', true, false, that.gamewidth, that.gameheight)
    });
  }

  addMenuOption (text, callback, finalmessage) {
    var optionStyle = { font: '24pt Arial', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(this.gamewidth/2 , this.gameheight/3  + (this.optionCount * this.gameheight/6), text, optionStyle);
    txt.anchor.set(0.5);
    var onOver = function (target) {
      target.fill = "yellow";
      target.stroke = "rgba(200,200,200,0.5)";
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
    };
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    if(finalmessage){
      txt.fill = finalmessage
    }else {
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback);
        txt.events.onInputOver.add(onOver);
        txt.events.onInputOut.add(onOut);
    }
    this.optionCount ++;
  }
}
