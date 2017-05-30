/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {
      this.stage.backgroundColor = '#EDEEC9'
      game.stage.disableVisibilityChange = false;
  }
  preload () {
      this.game.load.tilemap('level1', './assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tiles', './assets/images/tiles_spritesheet.png');
      this.game.load.spritesheet('player', 'assets/images/r1sht.png', 81, 82)
      this.game.load.image('coin','./assets/images/coinGold.png')
      this.coinSound = this.game.add.audio('coin')
      this.jumpSound = this.game.add.audio('jump')
      this.jumpSound.addMarker('spring',0,1)
      this.game.load.image('exp','./assets/images/exp.png')
      this.game.load.image('dust','./assets/images/dust.png')
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

      this.game.physics.setBoundsToWorld()

      this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

      this.score = 0
      this.scoreText = game.add.text(8, 8, 'Score: 0', { font: '12pt Arial', fill: 'black', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4});
      this.scoreText.fixedToCamera = true

      this.player = this.game.add.sprite(300, 200, 'player');

      this.player.scale.set(0.7,0.7)
      this.player.anchor.set(0.5,0.5)

      this.player.animations.add('idle',[8,9,9,10,10,11,11,8],8,true)

      this.player.animations.add('move',[0,1,2,3,4,5,6,7,8],10,true)

      game.physics.arcade.enable(this.player)
      this.player.body.setSize(60, 80, 8, 0);
      this.player.body.gravity.y = 600
      this.player.body.collideWorldBounds = true

      this.setParticles()

      this.player.animations.play('idle')
      //player.animations.play('attack', 60, false);
      this.cursors = game.input.keyboard.createCursorKeys();
      this.addGameMusic()
      this.addCoins()

      this.hasJumped = false
      game.camera.follow(this.player)
  }

  update () {
      let canJump = this.game.physics.arcade.collide(this.player,this.blockedLayer)
      this.game.physics.arcade.collide(this.coins,this.blockedLayer)
      this.game.physics.arcade.overlap(this.coins,this.player, this.takeCoin, null, this)

      if(this.cursors.right.isDown) {
          if(this.player.scale.x < 0) this.player.scale.x *= -1
          this.player.body.velocity.x = 100
          this.player.animations.play('move')
      } else if (this.cursors.left.isDown){
          if(this.player.scale.x > 0) this.player.scale.x *= -1
          this.player.body.velocity.x = -100
          this.player.animations.play('move')
      } else {
          this.player.body.velocity.x = 0
          this.player.animations.play('idle')
      }

      if(this.cursors.up.isDown && canJump){
          this.player.body.velocity.y = -400
          this.jumpSound.play('spring')
          this.burst.x = this.player.x
          this.burst.y = this.player.y+30
          this.burst.start(true, 300, null, 20)
          this.game.time.events.add(Phaser.Timer.SECOND, this.setJumpedTrue, this);
      }

      if(this.hasJumped && this.player.body.blocked.down){
          this.hasJumped = false
          this.dust.x = this.player.x;
          this.dust.y = this.player.y+30;
          this.dust.start(true, 300, null, 8);
      }

      if(this.player.body.onFloor() && this.player.body.y >= this.game.world.height - this.player.height){
          console.log('On floor')
      }

      // if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
      // {
      //     game.camera.y -= 4;
      // }
      // else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
      // {
      //     game.camera.y += 4;
      // }
      //
      // if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
      // {
      //     game.camera.x -= 4;
      // }
      // else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
      // {
      //     game.camera.x += 4;
      // }
  }

    addGameMusic () {
        this.game.music.stop()
        this.game.music = game.add.audio('grasslands');
        this.game.music.loop = true;
        this.game.music.play();
    }

    addCoins() {
      this.coins = this.game.add.group()
      this.coins.enableBody = true
      this.createCoin(this.coins,543,540)
      this.createCoin(this.coins,15,570)
      this.createCoin(this.coins,770,500)
      this.createCoin(this.coins,1090,340)
      game.physics.arcade.enable(this.coins)
    }

    createCoin(group, x, y) {
      let coin = this.game.add.sprite(x,y,'coin',0,group)
      coin.scale.set(0.5,0.5)
      coin.anchor.set(0.5,0.5)
      coin.body.setSize(40, 40, 15, 15);
      coin.body.gravity.y = 600
      coin.body.bounce.y = 1
    }

    takeCoin (player, coin) {
      this.coinSound.play()
      coin.kill()
      this.score += 100
      this.scoreText.text = "Score: "+ this.score
    }

    setParticles () {
      this.burst = game.add.emitter(0,0,10)
        this.burst.makeParticles('exp')
        this.burst.setYSpeed(-150,0)
        this.burst.setXSpeed(-150,150)

        this.dust = game.add.emitter(0, 0, 20);
        this.dust.makeParticles('dust');
        this.dust.setYSpeed(-100, 10);
        this.dust.setXSpeed(-100, 50);
    }

    setJumpedTrue(){
        this.hasJumped = true
    }

  render () {
    if (__DEV__) {
       this.game.debug.spriteInfo(this.player,32,32)
       this.game.debug.body(this.player);
       this.coins.forEachAlive(renderGroup, this)
       function renderGroup(member) {    game.debug.body(member);}
    }
  }
}
