declare function require(name:string)

const d0 = require('./data/menu/Salads.csv')
const d1 = require('./data/menu/BurgersSandwiches.csv')
const d2 = require('./data/menu/PastaNoodles.csv')
const d3 = require('./data/menu/MainDishesEntees.csv')
const d4 = require('./data/menu/Pizzas.csv')
const d5 = require('./data/menu/SoupStew.csv')
const d6 = require('./data/menu/Desserts.csv')

const csvData = [d0, d1, d2, d3, d4, d5, d6]

export const MAIN_DISH_INDEX = 3

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
    const requirement = baseRow[1]
    typeGroups.push({
      isSlotLeader: baseRow[0] === '*',
      requirement,
      words: baseRow.slice(2)
        .filter(w => !!w.trim()).map((word, j) => {
          return {
            name: word.trim(),
            price: priceRow[j + 2] || 0,
            pungency: pungencyRow[j + 2] || 0,
            requirement,
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

function hasWord(word) {
  return !!(word && word.name && word.name !== 'N/A')
}

function compileDish(words, course) {
  let prevWord = ''
  const filteredWords = words.filter((w, i) => {
    const _prevWord = prevWord
    const _nextWord = words[i + 1]
    prevWord = w
    if (!hasWord(w)) { return false }

    if (w.requirement === 'both') {
      return hasWord(_prevWord) && hasWord(_nextWord)
    }
    if (w.requirement === 'next') {
      return hasWord(_nextWord)
    }
    if (w.requirement === 'prev') {
      return hasWord(_prevWord)
    }
    return true
  })
  return {
    ...filteredWords.reduce((acc, i) => ({
      price: acc.price + i.price ,
      pungency: acc.pungency + i.pungency,
      name: acc.name ? `${acc.name} ${i.name}` : i.name
    }), {price: course.basePrice, pungency: 0, name: ''}),
  }
}

function getDishes(words, nextWordsGroup, course) {
  if (!nextWordsGroup.length) {
    count += 1
    return [compileDish(words, course)]
  }
  let nextWords = nextWordsGroup[0]
  if (nextWords.length === 0) { nextWords = [null] }
  const newNextWordsGroup = nextWordsGroup.slice(1)
  let i, ilen = nextWords.length
  let dishesNames = []

  for (i = 0; i < ilen; i++) {
    dishesNames = dishesNames.concat(getDishes(
      words.concat([nextWords[i]]),
      newNextWordsGroup,
      course
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
        levelPool = getDishes([], levelAvailableWords, course)
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

// console.log(allDishes)

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
  const levelData = course.levels[level - 1]
  let dishes
  if (levelData.levelPool) {
    dishes = getRandomSubArray(levelData.levelPool, count)
  } else {
    let i = 0
    dishes = []
    while(i++ < count) {
      dishes.push(
        compileDish(
          levelData.levelAvailableWords
            .map(ws => getRandom(ws)),
          course
        )
      )
    }
  }
  return {
    name: course.name,
    dishes,
  }
}
export function selectDishesInBatches(indexes, level, countPerIndex, countLoss = 0) {
  return indexes.map((index) => {
    return selectDishes(
      allDishes[index], level,
      countPerIndex - Math.round(countLoss * Math.random())
    )
  })
}
