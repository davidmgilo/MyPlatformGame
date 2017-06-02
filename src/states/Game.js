/* globals __DEV__ */
import Phaser from 'phaser'
import config from './../config'

export default class extends Phaser.State {
  init (widt, heigh) {
      this.gamewidth = widt
      this.gameheight = heigh
      this.game.scale.setGameSize(config.gameWidth, config.gameHeight)
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
      this.fireSound = this.game.add.audio('fire')
      this.jumpSound.addMarker('spring',0,1)
      this.game.load.image('exp','./assets/images/exp.png')
      this.game.load.image('dust','./assets/images/dust.png')
      this.game.load.image('door','./assets/images/window.png')
      this.game.load.image('bullet','./assets/images/bullet_2_blue.png')
      this.game.load.atlas('enemy','./assets/images/Enemies/enemy.png','./assets/images/Enemies/enemy.json')
  }

  create () {
      this.map = this.game.add.tilemap('level1');
      this.map.addTilesetImage('tiles','tiles');

      //create layer
      this.backgroundlayer = this.map.createLayer('backgroundLayer');
      this.blockedLayer = this.map.createLayer('blockedLayer');

      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();

      this.game.physics.setBoundsToWorld()

      this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

      this.game.gameOptions.lives = 3
      this.addHUD()

      this.spawnPlayer()

      this.door = this.game.add.sprite(1260,315,'door')

      this.player.scale.set(0.7,0.7)
      this.player.anchor.set(0.5,0.5)

      this.door.anchor.set(0.5,0.5)

      this.player.animations.add('idle',[8,9,9,10,10,11,11,8],8,true)

      this.player.animations.add('move',[0,1,2,3,4,5,6,7,8],10,true)
      this.player.animations.add('shoot',[17,18,18,19],10,false)

      this.player.events.onAnimationComplete.add(this.playIdle, this)

      game.physics.arcade.enable(this.player)
      this.player.body.setSize(60, 80, 8, 0);
      this.player.body.gravity.y = 600
      this.player.body.collideWorldBounds = true

      game.physics.arcade.enable(this.door)
      this.door.body.setSize(30,40,20,20);

      this.setParticles()

      this.player.animations.play('idle')
      //player.animations.play('attack', 60, false);
      this.cursors = game.input.keyboard.createCursorKeys();
      this.addGameMusic()
      this.addCoins()

      this.enemy = this.game.add.sprite(750,554,'enemy')
      this.enemy.animations.add('move',Phaser.Animation.generateFrameNames('slime'),5,true)
      this.enemy.animations.play('move')
      game.physics.arcade.enable(this.enemy)
      this.enemy.scale.set(0.5,0.5)
      this.enemy.anchor.set(0.5,0.5)
      this.enemy.maxX = 810
      this.enemy.minX = 720

      this.canShoot = true
      this.canShootTimerMax = 0.2
      this.canShootTimer = this.canShootTimerMax

      this.bullets = this.game.add.group()
      this.bullets.enableBody = true
      game.physics.arcade.enable(this.bullets)

      this.hasJumped = false
      game.camera.follow(this.player)
      this.player.bringToTop()
  }

  update () {
      console.log(this.game.gameOptions)
      let canJump = this.game.physics.arcade.collide(this.player,this.blockedLayer)
      this.game.physics.arcade.collide(this.coins,this.blockedLayer)
      this.game.physics.arcade.overlap(this.coins,this.player, this.takeCoin, null, this)
      this.game.physics.arcade.overlap(this.door,this.player, this.advance, null, this)


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
          if(this.player.animations.name !== 'shoot') this.player.animations.play('idle')
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

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC))
      {
          console.log('ESC')
          this.game.paused = true
      }

      this.canShootTimer = this.canShootTimer - (1/60)
      if(this.canShootTimer < 0){
          this.canShoot = true
          this.canShootTimer = this.canShootTimerMax
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      {
          if(this.canShoot){
              if(this.player.scale.x > 0) {
                  let bullet = this.game.add.sprite(this.player.x + 30, this.player.y, 'bullet', 0, this.bullets)
                  bullet.events.onOutOfBounds.add(this.destroyBullet, this);
                  bullet.anchor.set(0.5, 0.5)
                  bullet.body.setSize(bullet.body.height, bullet.body.width, -7, 7)
                  bullet.angle = 90
              } else {
                  let bullet = this.game.add.sprite(this.player.x - 30, this.player.y, 'bullet', 0, this.bullets)
                  bullet.events.onOutOfBounds.add(this.destroyBullet, this);
                  bullet.anchor.set(0.5, 0.5)
                  bullet.body.setSize(bullet.body.height, bullet.body.width, -7, 7)
                  bullet.angle = 270
              }
              this.player.animations.play('shoot')
              this.fireSound.play()
              this.canShoot = false
          }
      }

      this.bullets.forEachAlive(this.moveBullet, this)

      if(this.player.body.onFloor() && this.player.body.y >= this.game.world.height - this.player.height){
          this.die()
      }

      if(this.enemy.x == this.enemy.maxX || this.enemy.x == this.enemy.minX){
          this.enemy.scale.x *= -1
          this.moveEnemy(this.enemy)
      } else {
          this.moveEnemy(this.enemy)
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

    die (){
        game.camera.shake(0.05,200)
        // So de morir
        // this.deadSound.play()
        // Descomptar vides
        // Tornar a colocar usuari en posicio inicial
        this.playerIsDead = true

        // this.explosion.x = this.player.x
        // this.explosion.y = this.player.y+10
        // this.explosion.start(true, 300, null, 20)
        this.game.gameOptions.lives -= 1
        if(this.game.gameOptions.lives == 0){
            game.time.events.add(Phaser.Timer.SECOND * 0.3, this.gameOver, this);
        }else {
            this.lives.forEach(function (elem) {
                elem.kill()
            })
            this.addLives()
            this.spawnPlayer()
        }
    }

    spawnPlayer () {
        if(this.playerIsDead){
            this.player.x = 300
            this.player.y = 200
        }else {
            this.player = this.game.add.sprite(300, 200, 'player');
        }
        this.playerIsDead = false
    }

    addGameMusic () {
        if (this.game.gameOptions.musicPlayer.volume == 1){
            this.game.gameOptions.musicPlayer.stop()
            this.game.gameOptions.musicPlayer = game.add.audio('grasslands');
            this.game.gameOptions.musicPlayer.loop = true;
            this.game.gameOptions.musicPlayer.play();
        }
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
      coin.body.bounce.y = 0.9999
    }

    takeCoin (player, coin) {
      this.coinSound.play()
      coin.kill()
      this.game.gameOptions.score += 100
      this.scoreText.text = "Score: "+ this.game.gameOptions.score
    }

    destroyBullet(bullet){
      bullet.kill()
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

    advance(door, player) {
        console.log('Next level')
        this.state.start('GameOver', true, false, this.gamewidth, this.gameheight)
    }

    addHUD(){
        this.game.gameOptions.score = 0
        this.scoreText = game.add.text(8, 8, 'Score: 0', { font: '12pt Arial', fill: 'black', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4});
        this.scoreText.fixedToCamera = true
        this.namelevel = game.add.text(game.camera.width/2, 8, 'Level 1', { font: '12pt Arial', fill: 'black', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4});
        this.namelevel.fixedToCamera = true
        this.addLives()
    }

    addLives() {
        this.lives = this.game.add.group()
        var numberLive = this.game.gameOptions.lives
        for(;numberLive > 0;numberLive= numberLive-1){
            let life = this.game.add.sprite(game.camera.width-30*numberLive - 8,8,'player',0,this.lives)
            life.scale.set(0.4,0.4)
        }
        this.lives.fixedToCamera = true
    }

    moveBullet(bullet){
        if(bullet.angle == 90){
            bullet.x = bullet.x +5
        } else{
            bullet.x = bullet.x -5
        }
    }

    playIdle(){
        if(this.player.animations.name == 'shoot') {
            this.player.animations.play('idle')
        }
    }

    gameOver(){
      this.state.start('GameOver', true, false, this.gamewidth, this.gameheight)
    }

    moveEnemy(enemy){
        if(enemy.scale.x > 0) {
            enemy.x -= 1
        } else {
            enemy.x += 1
        }
    }

  render () {
    if (__DEV__) {
       this.game.debug.spriteInfo(this.player,32,32)
       this.game.debug.body(this.player);
       this.game.debug.body(this.door)
       this.game.debug.body(this.enemy)
       this.coins.forEachAlive(renderGroup, this)
       // this.bullets.forEachAlive(renderGroup, this)
       function renderGroup(member) {    game.debug.body(member);}
    }
  }
}
