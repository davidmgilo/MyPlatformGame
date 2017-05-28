/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
  }
  preload () {
  }

  create () {
    this.addGameMusic()
  }

  update () {
  }

  addGameMusic () {
    this.music = game.add.audio('intro');
    this.music.loop = true;
    this.music.play();
  }
}
