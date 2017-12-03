interface Dish {
  id?: number,
  name: string,
  description: string,
  price: number,
}

interface OrderItem {
  id: number,
  dish: Dish,
  deleted?: boolean,
}

interface Taste {
  a: number,
  b: number,
  c: number,
}