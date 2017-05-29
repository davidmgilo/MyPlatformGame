/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.titleText = game.make.text(game.world.centerX, 100, "Shoot 'n Jump", {
      font: 'bold 60pt Arial',
      fill: '#DA621E',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
  }
  preload () {
    this.optionCount = 0;
  }

  create () {
    this.addGameMusic()
    game.add.existing(this.titleText);
    game.stage.disableVisibilityChange = true;
    this.addOptions()
  }

  update () {
  }

  addGameMusic () {
    if(this.game.music) this.game.music.stop()
    this.game.music = game.add.audio('intro');
    this.game.music.loop = true;
    this.game.music.play();
  }

  addOptions () {
    var that = this
    this.addMenuOption('Start', function (target) {
      that.game.state.start('Game')
    });
    this.addMenuOption('Options', function (target) {
      that.game.state.start('Options')
    });
    this.addMenuOption('Credits', function (target) {
      console.log('You clicked Credits!');
    });
  }

  addMenuOption (text, callback) {
    var optionStyle = { font: '30pt Arial', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(30 + (this.optionCount * 250), 280, text, optionStyle);
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
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(onOver);
    txt.events.onInputOut.add(onOut);
    this.optionCount ++;
  }
}
