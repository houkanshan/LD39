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
  const menu = new Menu()
  const order = new Order()
  const player = new Player()
  const friend = new Friend()
  const waiter = new Waiter()

  PubSub.subscribe('menu.dish.select', (t, dish) => {
    player.wantDish(dish)
    delay(1000)()
    .then(() => friend.check(dish))
    .then(delay(1000))
    .then((accept) => {
      if (accept) {
        order.addOrder(dish)
      }
    })
  })
  PubSub.subscribe('menu.dish.help', (t, dish) => {
    player.askDish(dish)
    delay(1000)()
    .then(() => waiter.explainDish(dish))
  })
}

if (document.readyState === 'complete') {
  setTimeout(startGame, 500)
} else {
  window.onload = startGame
  setTimeout(startGame, 20000)
}