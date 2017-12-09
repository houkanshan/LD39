import {delay} from './utils'
import * as $ from 'jquery'
import typer from './typer'

const doc = $(document)

export default class Dialog {
  el: JQuery
  dfd: JQuery.Deferred<any, any, any>
  isSaying = false
  isWaitingClick = false
  constructor(el:JQuery) {
    this.el = el
  }
  say(text: string, needClick = true) {
    const dfd = $.Deferred()
    this.el.addClass('say')
    this.isSaying = true
    const typerPromise = typer(this.el, text)
    .then(delay(500))
    .then(() => this.isSaying = false)

    if (needClick) {
      typerPromise.then(() => {
        this.isWaitingClick = true
        this.el.addClass('is-waiting')
        doc.one('click', () => {
          this.isWaitingClick = false
          this.el.removeClass('is-waiting')
          dfd.resolve()
        })
      })
    } else {
      dfd.resolve()
    }
    return dfd.promise()
  }
  stopSay() {
    this.el.removeClass('say')
    typer(this.el, '…')
    this.isSaying = false
  }
}