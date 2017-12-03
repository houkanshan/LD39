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
    this.dialog.say(dish.description)
    .then(() => this.sayingType = SayingType.Silence)
  }
}