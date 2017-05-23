/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {
      this.game.load.tilemap('level1', './assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tiles', './assets/images/tiles_spritesheet.png');
  }

  create () {
    // const bannerText = 'Phaser + ES6 + Webpack'
    // let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    // banner.font = 'Bangers'
    // banner.padding.set(10, 16)
    // banner.fontSize = 40
    // banner.fill = '#77BFA3'
    // banner.smoothed = false
    // banner.anchor.setTo(0.5)
    //
    // this.mushroom = new Mushroom({
    //   game: this,
    //   x: this.world.centerX,
    //   y: this.world.centerY,
    //   asset: 'mushroom'
    // })

     // this.game.add.existing(this.mushroom)
      this.map = this.game.add.tilemap('level1');
      this.map.addTilesetImage('tiles','tiles');

      //create layer
      this.backgroundlayer = this.map.createLayer('backgroundLayer');
      this.blockedLayer = this.map.createLayer('blockedLayer');

      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();

      // this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

      this.cursors = game.input.keyboard.createCursorKeys();
  }

  update () {
      if (this.cursors.up.isDown)
      {
          game.camera.y -= 4;
      }
      else if (this.cursors.down.isDown)
      {
          game.camera.y += 4;
      }

      if (this.cursors.left.isDown)
      {
          game.camera.x -= 4;
      }
      else if (this.cursors.right.isDown)
      {
          game.camera.x += 4;
      }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
