import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import { SayingType } from './enums'
import Dialog from './dialog'
import { getRandom } from './utils'

// const textRecommend = [
//   'Have you tried turning him off and on again?',
//   'It would make life easier if Woody Allen’s movies were as easy and as right to condemn as his behavior.'
// ]
// const textMisc = [
//   'Dripping with snobbery, a voice message went viral and prompted a cascade of discussions about the sacred place of mate in Argentine society.',
//   'In which Republican donors pick your children’s pockets.',
//   'We used to blame both parties for our poisonous political environment. Not anymore.',
// ]

// const allText = [...textRecommend, ...textMisc]

export default class Waiter {
  el: JQuery
  dialog: Dialog
  sayingType: SayingType
  constructor() {
    this.el = $('#waiter')
    this.dialog = new Dialog(this.el.find('.dialog'))
    this.sayingType = SayingType.Silence
  }

  // explainDish(dish: Dish) {
  //   this.sayingType = SayingType.Explaining
  //   PubSub.publish('player.ask', dish)
  //   return this.dialog.say(dish.description)
  // }

  // lastTexts: Array<string> = []
  // bufferLen = 1

  // chooseFrom(array: Array<string>) {
  //   const text = getRandom(array, this.lastTexts)
  //   this.lastTexts = [text, ...this.lastTexts.slice(0, this.bufferLen - 1)]
  //   return text
  // }

  // nag() {
  //   this.sayingType = SayingType.Misc
  //   const text = this.chooseFrom(allText)
  //   PubSub.publish('waiter.nag')
  //   return this.dialog.say(text)
  // }

  // recommend() {
  //   this.sayingType = SayingType.Recommending
  //   const text = this.chooseFrom(textRecommend)
  //   PubSub.publish('waiter.recommend')
  //   return this.dialog.say(text)
  // }
}