declare function require(name:string)

const d1 = require('./data/Salads.csv')
const d2 = require('./data/BurgersSandwiches.csv')
const d3 = require('./data/PastaNoodles.csv')
const d4 = require('./data/MainDishesEntees.csv')
const d5 = require('./data/Pizzas.csv')
const d6 = require('./data/SoupStew.csv')
const d7 = require('./data/Desserts.csv')

const csvData = [d1, d2, d3, d4, d5, d6, d7]

function parseData(data) {
  const name = data[0][0]
  const basePrice = data[0][1]
  const table = data.slice(1)
  // 1. group by level
  const typeGroups = []
  let i = 0
  while (i < table.length) {
    const baseRow = table[i]
    const priceRow = table[i+1]
    const pungencyRow = table[i+2]
    typeGroups.push({
      isSlotLeader: baseRow[0] === '*',
      requirement: baseRow[1],
      words: baseRow.slice(2)
        .filter(w => !!w.trim()).map((word, j) => {
          return {
            name: word.trim(),
            price: priceRow[j + 2] || 0,
            pungency: pungencyRow[j + 2] || 0,
          }
      })
    })
    i += 3
  }
  // 2. group by word slot
  const slotGroups = []
  i = 0
  let lastSlotGroup
  while (i < typeGroups.length) {
    if (typeGroups[i].isSlotLeader) {
      lastSlotGroup = []
      slotGroups.push(lastSlotGroup)
    }
    lastSlotGroup.push(typeGroups[i])
    i += 1
  }
  return {
    name,
    basePrice,
    slotGroups,
  }
}

function parseAllData() {
  return csvData.map(parseData)
}

let count = 0

function compileDish(words) {
  const name = words.map(w => w.name).join(' ')
  return {
    ...words.reduce((acc, i) => ({
      price: acc.price + i.price ,
      pungency: acc.pungency + i.pungency,
    }), {price: 0, pungency: 0}),
    // TODO
    name,
  }
}

function getDishes(words, nextWordsGroup) {
  if (!nextWordsGroup.length) {
    count += 1
    return [compileDish(words)]
  }
  let nextWords = nextWordsGroup[0]
  if (nextWords.length === 0) { nextWords = [''] }
  const newNextWordsGroup = nextWordsGroup.slice(1)
  let i, ilen = nextWords.length
  let dishesNames = []

  for (i = 0; i < ilen; i++) {
    dishesNames = dishesNames.concat(getDishes(
      words.concat([nextWords[i]]),
      newNextWordsGroup
    ))
  }
  return dishesNames
}

function generateAllDishes() {
  const allData = parseAllData()
  return allData.map((course) => {
    const levels = [1,2,3,4].map((level) => {
      const dishesWords = []
      const slotGroups = course.slotGroups
      const levelAvailableWords = slotGroups.map((slotGroup) => {
        let slotAvailableWords = []
        slotGroup.forEach((levelSlot) => {
          if (
            typeof levelSlot.requirement !== 'number' ||
            levelSlot.requirement <= level
          ) {
            slotAvailableWords = slotAvailableWords.concat(levelSlot.words)
          }
        })
        return slotAvailableWords
      })
      const levelPoolLength = levelAvailableWords.reduce((acc, item) =>
        item.length ? acc * item.length : acc, 1
      )
      let levelPool = null
      if (levelPoolLength < 1000) {
        levelPool = getDishes([], levelAvailableWords)
      }
      return {
        levelPool,
        levelPoolLength,
        levelAvailableWords,
      }
    })
    return {
      ...course,
      levels,
    }
  })
}

const allDishes = generateAllDishes()

console.log(allDishes)

function getRandomSubArray(array, count) {
  // Make a copy of the array
  var tmp = array.slice()
  var ret = []

  for (var i = 0; i < count; i++) {
    var index = Math.floor(Math.random() * tmp.length)
    var removed = tmp.splice(index, 1)
    ret.push(removed[0])
  }
  return ret
}
function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function selectDishes(course, level, count) {
  const levelData = course.levels[level]
  if (levelData.pool && false) {
    // return getRandomSubArray(levelData.pool, count)
  } else {
    let i = 0
    const dishes = []
    while(i++ < count) {
      dishes.push(
        compileDish(
          levelData.levelAvailableWords
            .filter(ws => ws.length)
            .map(ws => getRandom(ws))
        )
      )
    }
    return dishes
  }
}

function batchSelectDishes(indexes, level, countPerIndex) {
  return indexes.map((index) => {
    return selectDishes(allDishes[index], level, countPerIndex)
  })
}

console.log(batchSelectDishes([0, 1, 2], 1, 2))