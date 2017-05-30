import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    // this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.loadBgm()

  }

  create () {
    this.state.start('Menu')
  }

  loadBgm () {
    this.load.audio('intro', 'assets/music/intro.mp3');
    this.load.audio('grasslands', 'assets/music/grasslands.mp3');
    this.load.audio('coin', 'assets/music/pickedCoin.wav');
    this.load.audio('jump', 'assets/music/sound-plasticknife.mp3');
    // game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
  }
}
