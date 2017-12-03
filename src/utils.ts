export function append<T>(array: Array<T>, item: T): Array<T> {
  return [...array, item]
}

export function change<T>(array: Array<T>, index: number, newItem: T): Array<T> {
  return [
    ...array.slice(0, index),
    newItem,
    ...array.slice(index + 1)
  ]
}