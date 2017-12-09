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

const body = $(document.body)

function startGame() {
  if (body.hasClass('on')) { return }
  body.addClass('on')

  startMainScene()

  setTimeout(function () {
    body.addClass('hide-loading-layer')
  }, 1010)
}

function startMainScene() {
  PubSub.subscribe('menu', (t, d) => console.log(t, d))
  PubSub.subscribe('order', (t, d) => console.log(t, d))

  const beginTime = new Date()

  const menu = new Menu()
  const order = new Order({ beginTime })
  const player = new Player()
  const friend = new Friend()
  const waiter = new Waiter()

  PubSub.subscribe('menu.dish.select', (t, dish) => {
    friend.dialog.stopSay()
    waiter.dialog.stopSay()
    player.wantDish(dish)
    .then(delay(100))
    .then(() => friend.check(dish))
    .then((accept) => {
      if (accept) {
        order.addOrder(dish)
      } else {
        waiter.recommend()
      }
    })
  })
  PubSub.subscribe('menu.dish.help', (t, dish) => {
    player.askDish(dish)
    .then(delay(1000))
    .then(() => waiter.explainDish(dish))
  })

  setTimeout(function waiterNag() {
    if (
      !friend.dialog.isSaying &&
      !player.dialog.isSaying &&
      !waiter.dialog.isSaying
    ) {
      waiter.nag()
    }
    setTimeout(waiterNag, 10000 + Math.random() * 5000)
  }, 2000)
}

if (document.readyState === 'complete') {
  setTimeout(startGame, 500)
} else {
  window.onload = startGame
  setTimeout(startGame, 20000)
}