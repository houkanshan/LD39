import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import { SayingType } from './enums'
import Dialog from './dialog'

export default class Waiter {
  el: JQuery
  dialog: Dialog
  sayingType: SayingType
  constructor() {
    this.el = $('#waiter')
    this.dialog = new Dialog(this.el.find('.dialog'))
    this.sayingType = SayingType.Silence
  }

  explainDish(dish: Dish) {
    this.sayingType = SayingType.Explaining
    PubSub.publish('player.ask', dish)
    return this.dialog.say(dish.description)
  }

  recommend() {
    this.sayingType = SayingType.Recommending
    PubSub.publish('waiter.recommend')
    return this.dialog.say(`Tonight is good!`)
  }
}