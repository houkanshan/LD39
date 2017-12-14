import './style'
import * as $ from 'jquery'
import './libs/turn'
import PubSub from 'pubsub-js'
import Menu from './menu'
import Order from './order'
import Friend from './friend'
import Player from './player'
import Waiter from './waiter'
import { delay } from './utils'
import chooseConversation from './dialogText'
import { ConversationType } from './enums'

const body = $(document.body)

function startGame() {
  if (body.hasClass('on')) { return }
  body.addClass('on')

  const game = new Game()
  game.start()

  setTimeout(function () {
    body.addClass('hide-loading-layer')
  }, 1010)
}

class Game {
  beginTime: Date
  level: number
  nextLevel: number
  passingRate: number
  passedCount: number

  menu: Menu
  order: Order
  player: Player
  friend: Friend
  waiter: Waiter
  speakers: Array<Player|Friend|Waiter>

  start() {
    PubSub.subscribe('menu', (t, d) => console.log(t, d))
    PubSub.subscribe('order', (t, d) => console.log(t, d))

    this.beginTime = new Date()
    this.level = 1
    this.nextLevel = 1
    this.passingRate = 0
    this.passedCount = 0

    this.menu = new Menu({ level: this.level })
    this.order = new Order({ beginTime: this.beginTime })
    this.player = new Player()
    this.friend = new Friend()
    this.waiter = new Waiter()
    this.speakers = [this.player, this.friend, this.waiter]

    debugger
    this.startConversation(ConversationType.START)

    PubSub.subscribe('menu.dish.select', (t, dish) => {
      const passed = this.judge(dish)
      this.startConversation(ConversationType.DISH, dish, passed).then(() => {
        if (passed) {
          this.order.addOrder(dish)
        }
      }).then(() => {
        if (this.nextLevel === 5) {
          this.end()
        } else if (this.level !== this.nextLevel) {
          this.setLevel(this.nextLevel)
        }
      })
    })

    PubSub.subscribe('menu.page.turned', (t, pageNum) => {
      if (pageNum >= 3 + 7 + 2 && this.level === 1) {
        this.passedCount = 1
        this.setLevel(2)
      }
    })
  }
  end() {
    console.log('end')
  }
  setLevel(level) {
    this.level = level
    this.nextLevel = level
    this.menu.setLevel(level)
    this.passingRate = 0
    console.log('level upgraded: ', level)
    // PubSub.publish('level.updated', level)
  }
  passingRateIncrementMap = [
    1, // level 0 does not exist.
    0.2,
    0.15,
    0.10,
    0.05,
  ]
  judge(dish) {
    if (dish.pungency > 2) { return false }

    const  passed = Math.random() < this.passingRate
    if (passed) {
      this.passedCount += 1
      if (this.passedCount >= 1 && this.level < 2) {
        this.nextLevel = 2
      } else if (this.passedCount >= 2 && this.level < 3) {
        this.nextLevel = 3
      } else if (this.passedCount >= 3 && this.level < 4) {
        this.nextLevel = 4
      } else if (this.passedCount >= 6) {
        this.nextLevel = 5
      }
    } else {
      this.passingRate += this.passingRateIncrementMap[this.level]
    }
    return passed
  }
  startConversation(type: ConversationType, dish?, passed?: boolean) {
    this.menu.stop()
    const dialog = chooseConversation(type, dish, this.level, passed)
    return dialog.reduce((prev, { speakerIndex, text }) => {
      return prev.then(() => this.speakers[speakerIndex].dialog.say(text))
    }, $.Deferred().resolve())
    .then(() => {
      this.menu.resume()
    })
  }
}

// Not in use.
// function startMainScene() {
  // PubSub.subscribe('menu.dish.help', (t, dish) => {
  //   player.askDish(dish)
  //   .then(delay(1000))
  //   .then(() => waiter.explainDish(dish))
  // })

  // setTimeout(function waiterNag() {
  //   if (
  //     !friend.dialog.isSaying &&
  //     !player.dialog.isSaying &&
  //     !waiter.dialog.isSaying
  //   ) {
  //     waiter.nag()
  //   }
  //   setTimeout(waiterNag, 10000 + Math.random() * 5000)
  // }, 2000)
// }


if (document.readyState === 'complete') {
  setTimeout(startGame, 500)
} else {
  window.onload = startGame
  setTimeout(startGame, 5000)
}