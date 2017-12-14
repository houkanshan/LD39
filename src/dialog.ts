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
    this.el.addClass('is-saying')
    this.isSaying = true
    const typerPromise = typer(this.el, text)
    .then(() => this.isSaying = false)

    if (needClick) {
      typerPromise
      .then(() => {
        this.isWaitingClick = true
        this.el.addClass('is-waiting')
        this.el.removeClass('is-saying')
        doc.one('click', () => {
          this.isWaitingClick = false
          this.el.removeClass('is-waiting')
          dfd.resolve()
        })
      })
    } else {
      this.el.removeClass('is-saying')
      dfd.resolve()
    }
    return dfd.promise()
  }
}