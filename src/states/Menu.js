/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init (widt, heigh) {
    this.gamewidth = widt
    this.gameheight = heigh
    game.world.width = this.gamewidth
    this.stage.backgroundColor = '#1496BB'
    //this.game.renderer.resize(this.gamewidth, this.gameheight)
    this.titleText = game.make.text(game.world.centerX, 100, "Shoot 'n Jump", {
      font: 'bold 60pt Arial',
      fill: '#DA621E',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    if(this.titleText.anchor.x === 0){
      this.titleText.anchor.set(0.5);
    }
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
    if(!this.game.gameOptions.musicPlayer || this.game.gameOptions.musicPlayer.key !== 'intro'){
      if(this.game.gameOptions.musicPlayer)this.game.gameOptions.musicPlayer.stop()
      this.addIntroMusic()
    } else{
      console.log('Ja està en marxa!!')
    }
  }

  addIntroMusic(){
      this.game.gameOptions.musicPlayer = game.add.audio('intro');
      this.game.gameOptions.musicPlayer.loop = true;
      this.game.gameOptions.musicPlayer.play();
  }

  addOptions () {
    var that = this
    this.addMenuOption('Start', function (target) {
      that.game.state.start('Game', true, false, that.gamewidth, that.gameheight)
    });
    this.addMenuOption('Options', function (target) {
      that.game.state.start('Options', true, false, that.gamewidth, that.gameheight)
    });
    this.addMenuOption('Credits', function (target) {
      console.log('You clicked Credits!');
      window.location = "http://github.com/davidmgilo/MyPlatformGame"
    });
  }

  addMenuOption (text, callback) {
    var optionStyle = { font: '30pt Arial', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(30 + (this.optionCount * 250), 300, text, optionStyle);
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
