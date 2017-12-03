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

export function delay(time) {
  return function(data?:any): Promise<any> {
    const dfd = $.Deferred()
    setTimeout(function () {
      dfd.resolve(data)
    }, time)
    return dfd.promise()
  }
}

export function getRandom<T>(arr: Array<T>, excludes : Array<T> = []) {
  const filteredArr = arr.filter((item) => excludes.indexOf(item) === -1)
  return filteredArr[Math.floor(Math.random() * filteredArr.length)]
}