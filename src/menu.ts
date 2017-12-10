import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import {selectDishesInBatches, MAIN_DISH_INDEX} from './menuText'
import {shuffle} from './utils'

export default class Menu {
  el: JQuery
  book: JQuery
  dishes: Array<Dish> = []
  level:number
  stopped = false
  constructor(options) {
    this.el = $("#menu")
    this.level = options.level
    this.book = this.el.turn({
      width: 688,
      height: 529,
      when: {
        start: (e, pageObject) => {
          if (this.stopped) { e.preventDefault() }
          if (pageObject.next + 4 > this.book.turn('pages')) {
            this.addPagesGroup()
          }
        },
      }
    })
    this.addPagesGroup()

    this.el.on('click', '.dish-item', this.clickDish.bind(this))
    // this.el.on('click', '.dish-help', this.clickDishHelp.bind(this))
  }
  setLevel(level:number) { this.level = level }
  addPagesGroup() {
    this.generateDishes().forEach(course => {
      this.addPage(course)
    })
  }
  defaultCourseIndexes = [0, 1, 2, 3, 4, 6]
  generateDishes() {
    let indexes = this.defaultCourseIndexes.slice()
    if (this.dishes.length) {
      indexes = shuffle(indexes)
    }
    // insert 2 more main dishes
    indexes.splice(indexes.indexOf(MAIN_DISH_INDEX), 0, MAIN_DISH_INDEX, MAIN_DISH_INDEX)
    console.log(indexes)
    const courses = selectDishesInBatches(indexes, Math.max(this.level, 2), 7, 2)
    courses[indexes.indexOf(MAIN_DISH_INDEX) + 1].noTitle = true
    courses[indexes.indexOf(MAIN_DISH_INDEX) + 2].noTitle = true

    const lastId = this.dishes.length
    let newDishes = []
    courses.forEach(course => {
      newDishes = newDishes.concat(course.dishes)
    })
    newDishes.forEach((dish, i) => dish.id = i + lastId)
    this.dishes = this.dishes.concat(newDishes)
    return courses
  }
  addPage({ name, dishes, noTitle }) {
    const page = $('<div>')
    if (noTitle) { page.addClass('no-title') }
    page.append($('<h3>').text(`- ${name} -`))
    const dishesContent = $('<div>').addClass('dishes-content')
    page.append(dishesContent)

    dishes.forEach(dish => {
      dishesContent.append(
        template(`
          <div class="dish-item" data-id="{{=it.id}}">
            <span class="dish-title">
              <span class="text">{{=it.name}}</span>
              <span class="dish-pungency">
                {{ for(var i = 0; i < it.pungency; i ++) { }}
                <i/>
                {{ } }}
              </span>
            </span>
            <span class="dish-price">\${{=it.price}}</span>
          </div>
        `)(dish)
      )
    })
    const pageNum = this.book.turn('pages') + 1
    page.append($('<span>', { 'class': 'page-num' }).text(`- ${pageNum} -`))
    this.book.turn('addPage', page, pageNum)
  }

  stop() {
    this.stopped = true
    this.book.turn('disable', true)
  }
  resume() {
    this.stopped = false
    this.book.turn('disable', false)
  }

  clickDish(e) {
    if (this.stopped) { return }
    const target = $(e.target).closest('.dish-item')
    const dishId = target.data('id')
    const dish = this.dishes[dishId]
    PubSub.publish('menu.dish.select', dish)
  }
  clickDishHelp(e) {
    if (this.stopped) { return }
    const target = $(e.target).closest('.dish-item')
    const dishId = target.data('id')
    const dish = this.dishes[dishId]
    PubSub.publish('menu.dish.help', dish)
  }
}