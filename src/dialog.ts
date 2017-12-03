import {delay} from './utils'
import * as $ from 'jquery'
import typer from './typer'

export default class Dialog {
  el: JQuery
  dfd: JQuery.Deferred<any, any, any>
  constructor(el:JQuery) {
    this.el = el
  }
  say(text: string) {
    this.el.addClass('say')
    this.dfd = $.Deferred()
    return typer(this.el, text)
    .then(delay(500))
  }
  stopSay() {
    if (!this.dfd) { return }
    this.el.removeClass('say').text('...')
    this.dfd.reject()
  }
}