import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import { append, change, getMonthWord, getTime, randomDigital } from './utils'

export default class Order {
  el: JQuery
  elList: JQuery
  orderItems: Array<OrderItem>
  constructor(options) {
    this.orderItems = []
    this.el = $('#order')
    this.elList = this.el.find('.list')
    const beginTime: Date = options.beginTime

    this.el.find('.time').text(
      `${getMonthWord(beginTime.getMonth())} ${beginTime.getDate()}, ${beginTime.getFullYear()}` +
      ` at ${getTime(beginTime)}`
    )
    this.el.find('.order-number').text(
      `Order: #${randomDigital(5)}-${randomDigital(3)}`
    )
    this.el.find('.table-number').text(
      `Table: ${randomDigital(2)} SEC${randomDigital(1)}`
    )

    this.elList.on('click', '.btn-delete', this.deleteOrder.bind(this))
  }
  renderItem(order) {
    return  template(`
      <div
        class="order-item {{=it.deleted ? 'is-deleted' : ''}}"
        data-id="{{=it.id}}"
      >
        <span class="order-title">{{=it.dish.name}}</span>
      </div>
    `)(order)
  }
  addOrder(dish) {
    const order = { dish, id: this.orderItems.length }
    this.orderItems = append(this.orderItems, order)
    this.elList.append(this.renderItem(order))
    PubSub.publish('order.added', order)
  }
  deleteOrder(e) {
    const target = $(e.target).closest('.order-item')
    const orderId = target.data('id')
    const newOrder = {
      ...this.orderItems[orderId],
      deleted: true,
    }
    this.orderItems = change(this.orderItems, orderId, newOrder)
    target.replaceWith(this.renderItem(newOrder))
    PubSub.publish('order.deleted', newOrder)
  }
}