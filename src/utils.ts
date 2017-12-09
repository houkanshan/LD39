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

export function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function getMonthWord(monthIndex) {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][monthIndex]
}

export function leftPad2(i: any): string {
  const pad = '00'
  return pad.substring(0, pad.length - i.toString().length) + i
}

export function getTime(time: Date): string {
  return `${leftPad2(time.getHours())}:${leftPad2(time.getMinutes())}`
}

export function randomDigital(bit) {
  return Math.random().toFixed(bit).slice(2)
}