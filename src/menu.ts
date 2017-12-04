import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import './menuText'

export default class Menu {
  el: JQuery
  book: JQuery
  dishes: Array<Dish>
  constructor() {
    this.el = $("#menu")
    this.book = this.el.turn({
      width: 640,
      height: 480,
      when: {
        start: (e, pageObject) => {
          if (pageObject.next + 4 > this.book.turn('pages')) {
            this.addPage(this.generateDishes())
          }
        },
      }
    })
    // TODO
    this.dishes = [
      {
        name: 'chicken 1',
        description: 'The recipe from an oiled by fried and can.',
        price: 100,
      },
      {
        name: 'chicken 2',
        description: 'Prepare sour cream into egg coloring; drain first pans in a large bowl.',
        price: 200,
      },
      {
        name: 'chicken 3',
        description: 'Prepare sour cream into egg coloring; drain first pans in a large bowl.',
        price: 200,
      },
      {
        name: 'chicken 4',
        description: 'Prepare sour cream into egg coloring; drain first pans in a large bowl.',
        price: 200,
      }
    ]
    this.dishes.forEach((dish, i) => dish.id = i)

    this.addPage(this.dishes)
    this.addPage(this.dishes)

    this.el.on('click', '.dish-title', this.clickDish.bind(this))
    this.el.on('click', '.dish-help', this.clickDishHelp.bind(this))
  }
  generateDishes(taste?: Taste) {
    // TODO
    return this.dishes.slice()
  }
  addPage(dishes) {
    const frontFaceDishes = dishes.slice(0, dishes.length / 2)
    const backFaceDishes = dishes.slice(dishes.length / 2)
    this.addPageFace(frontFaceDishes)
    this.addPageFace(backFaceDishes)
  }
  addPageFace(dishes) {
    const page = $('<div>')
    dishes.forEach(dish => {
      page.append(
        template(`
          <div class="dish-item" data-id="{{=it.id}}">
            <span class="dish-title">{{=it.name}}</span>
            <span class="dish-help">?</span>
          </div>
        `)(dish)
      )
    })
    this.book.turn('addPage', page, this.book.turn('pages') + 1)
  }

  clickDish(e) {
    const target = $(e.target).closest('.dish-item')
    const dishId = target.data('id')
    const dish = this.dishes[dishId]
    PubSub.publish('menu.dish.select', dish)
  }
  clickDishHelp(e) {
    const target = $(e.target).closest('.dish-item')
    const dishId = target.data('id')
    const dish = this.dishes[dishId]
    PubSub.publish('menu.dish.help', dish)
  }
}