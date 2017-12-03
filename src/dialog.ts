import {delay} from './utils'
import * as $ from 'jquery'

export default class Dialog {
  el: JQuery
  constructor(el:JQuery) {
    this.el = el
  }
  say(text: string) {
    this.el
      .text(text)
      .addClass('say')
    return delay(5000)()
    .then(() => {
      this.el.removeClass('say')
      .text('')
    })
  }
}