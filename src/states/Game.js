/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {
      this.game.load.tilemap('level1', './assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tiles', './assets/images/tiles_spritesheet.png');
      this.game.load.spritesheet('player', 'assets/images/r1sht.png', 81, 82)
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

      this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

      this.player = this.game.add.sprite(300, 200, 'player');

      this.player.scale.set(0.7,0.7)

      this.player.animations.add('idle',[8,9,9,10,10,11,11,12,12],8,true)

      this.player.animations.add('moveRight',[0,1,2,3,4,5,6,7,8],10,true)

      game.physics.arcade.enable(this.player)
      this.player.body.gravity.y = 600

      this.player.animations.play('idle')
      //player.animations.play('attack', 60, false);
      this.cursors = game.input.keyboard.createCursorKeys();
  }

  update () {
      this.game.physics.arcade.collide(this.player,this.blockedLayer)

      if(this.cursors.right.isDown) {
          this.player.body.velocity.x = 100
          this.player.animations.play('moveRight')
      } else {
          this.player.body.velocity.x = 0
          this.player.animations.play('idle')
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
      {
          game.camera.y -= 4;
      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
      {
          game.camera.y += 4;
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
      {
          game.camera.x -= 4;
      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
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
