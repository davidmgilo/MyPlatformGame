import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init (widt, heigh) {
    this.gamewidth = widt
    this.gameheight = heigh
    this.stage.backgroundColor = '#1496BB'
    var height = window.innerHeight;
    var width = window.innerWidth;
    this.game.scale.setGameSize(width,height)
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '32px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')


    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.game.gameOptions = {
          playMusic: true,
          playSound: true,
          musicPlayer: null,
          score: 0,
          lives: 3
    }
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash', true, false, this.gamewidth, this.gameheight)
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
