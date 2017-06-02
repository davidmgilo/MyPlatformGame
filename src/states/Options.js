/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init (widt, heigh) {
    this.gamewidth = widt
    this.gameheight = heigh
    this.titleText = game.make.text(game.world.centerX, this.gameheight/5, "Options", {
      font: 'bold 40pt Arial',
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
    game.add.existing(this.titleText);
    game.stage.disableVisibilityChange = true;
    this.addOptions()
  }

  update () {
  }

  addOptions () {
    var that = this
    this.addMenuOption(this.game.gameOptions.playMusic ? 'Mute Music' : 'Play Music', function (target) {
      that.game.gameOptions.playMusic = !that.game.gameOptions.playMusic;
      target.text = that.game.gameOptions.playMusic ? 'Mute Music' : 'Play Music';
      that.game.gameOptions.musicPlayer.volume = that.game.gameOptions.playMusic ? 1 : 0;
    });
    this.addMenuOption(this.game.gameOptions.playSound ? 'Mute Sound' : 'Play Sound', function (target) {
      that.game.gameOptions.playSound = !that.game.gameOptions.playSound;
      target.text = that.game.gameOptions.playSound ? 'Mute Sound' : 'Play Sound';
    });
    this.addMenuOption("<- Back", function (target) {
      that.game.state.start('Menu', true, false, that.gamewidth, that.gameheight)
    });
  }

  addMenuOption (text, callback) {
    var optionStyle = { font: '24pt Arial', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(game.world.centerX , this.gamewidth/6  + (this.optionCount * this.gamewidth/15), text, optionStyle);
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
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(onOver);
    txt.events.onInputOut.add(onOut);
    this.optionCount ++;
  }
}
