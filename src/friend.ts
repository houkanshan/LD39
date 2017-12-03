import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import { SayingType } from './enums'
import Dialog from './dialog'

export default class Friend {
  el: JQuery
  dialog: Dialog
  sayingType: SayingType
  taste: Taste
  constructor() {
    this.el = $('#friend')
    this.dialog = new Dialog(this.el.find('.dialog'))
    this.sayingType = SayingType.Silence
  }

  check(dish) {
    const isOk = Math.random() > 0.5
    this.sayingType = SayingType.Judging
    PubSub.publish('friend.judge', { dish, isOk })
    return this.dialog.say(isOk ? 'Fine.' : 'No.')
    .then(() => isOk)
  }
}