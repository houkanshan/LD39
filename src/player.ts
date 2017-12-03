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
    this.el = $('#player')
    this.dialog = new Dialog(this.el.find('.dialog'))
    this.sayingType = SayingType.Silence
  }

  askDish(dish: Dish) {
    this.sayingType = SayingType.Asking
    PubSub.publish('player.ask', dish)
    return this.dialog.say(`What is ${dish.name}?`)
    .then(() => this.sayingType = SayingType.Silence)
  }

  wantDish(dish: Dish) {
    this.sayingType = SayingType.Consulting
    PubSub.publish('player.consult', dish)
    return this.dialog.say(`How about ${dish.name}?`)
  }
}