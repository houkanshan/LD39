import PubSub from 'pubsub-js'
import * as $ from 'jquery'
import { template } from 'dot'
import { append, change } from './utils'

export default class Order {
  el: JQuery
  elList: JQuery
  orderItems: Array<OrderItem>
  constructor() {
    this.orderItems = []
    this.el = $('#order')
    this.elList = this.el.find('.list')

    this.elList.on('click', '.btn-delete', this.deleteOrder.bind(this))
  }
  renderItem(order) {
    return  template(`
      <li
        class="order-item {{=it.deleted ? 'is-deleted' : ''}}"
        data-id="{{=it.id}}"
      >
        <span class="order-title">{{=it.dish.name}}</span>
        <span class="btn-delete">×</span>
      </li>
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