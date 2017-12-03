import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import { SayingType } from './enums'
import Dialog from './dialog'

export default class Friend {
  el: JQuery
  dialog: Dialog
  sayingType: SayingType
  constructor() {
    this.el = $('#friend')
    this.dialog = new Dialog(this.el.find('.dialog'))
    this.sayingType = SayingType.Silence
  }

  check(dish) {
    const isOk = true
    this.sayingType = SayingType.Judging
    PubSub.publish('friend.judge', { dish, isOk })
    this.dialog.say('Fine.')
    .then(() => this.sayingType = SayingType.Silence)
    return isOk
  }
}