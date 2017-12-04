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

function getDishesWords(words, nextWordsGroup) {
  if (!nextWordsGroup.length) {
    count += 1
    return [words]
  }
  let nextWords = nextWordsGroup[0]
  if (nextWords.length === 0) { nextWords = [''] }
  const newNextWordsGroup = nextWordsGroup.slice(1)
  let i, ilen = nextWords.length
  let dishesWords = []

  for (i = 0; i < ilen; i++) {
    dishesWords = dishesWords.concat(getDishesWords(
      words.concat([nextWords[i]]),
      newNextWordsGroup
    ))
  }
  return dishesWords
}

function generateAllDishes() {
  const allData = parseAllData()
  return allData.map((course) => {
    return {
      ...course,
      levels: [1,2,3,4].map((level) => {
        const dishesWords = []
        const slotGroups = course.slotGroups
        return slotGroups.map((slotGroup) => {
          let availableWords = []
          slotGroup.forEach((levelSlot) => {
            if (
              typeof levelSlot.requirement !== 'number' ||
              levelSlot.requirement <= level
            ) {
              availableWords = availableWords.concat(levelSlot.words)
            }
          })
          return availableWords
        })
      })
    }
  })
}

console.log(generateAllDishes())