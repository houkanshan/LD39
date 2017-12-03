import {delay} from './utils'
import * as $ from 'jquery'
import typer from './typer'

export default class Dialog {
  el: JQuery
  dfd: JQuery.Deferred<any, any, any>
  isSaying = false
  constructor(el:JQuery) {
    this.el = el
  }
  say(text: string) {
    this.el.addClass('say')
    this.isSaying = true
    return typer(this.el, text)
    .then(delay(500))
    .then(() => this.isSaying = false)
  }
  stopSay() {
    this.el.removeClass('say')
    typer(this.el, '…')
    this.isSaying = false
  }
}