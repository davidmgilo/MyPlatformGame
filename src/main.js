import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import GameState2 from './states/Game2'
import Menu from './states/Menu'
import Options from './states/Options'
import GameOver from './states/GameOver'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth
    const height = docElement.clientHeight

    super(config.gameWidth, config.gameHeight, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Menu', Menu, false)
    this.state.add('Options', Options, false)
    this.state.add('Game', GameState, false)
    this.state.add('Game2', GameState2, false)
    this.state.add('GameOver', GameOver, false)

    this.state.start('Boot', true, false, width, height)
  }
}

window.game = new Game()
