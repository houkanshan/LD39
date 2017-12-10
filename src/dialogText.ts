declare function require(name:string)

const d0 = require('./data/dialog/begin.csv')

const speakerMap = {
  A: 0, a: 0,
  B: 1, b: 1,
  C: 2, c: 2,
}

function parseDialogTree(table) {
  const conversationGroup = []
  let conversation = []
  for (let i = 0, ilen = table.length; i < ilen; i ++) {
    const row = table[i]
    if (!row[0] && conversation.length) {
      conversationGroup.push(conversation)
      conversation = []
      continue
    }
    conversation.push({
      speakerIndex: speakerMap[row[0].trim()],
      text: row[1].trim(),
    })
  }
  conversationGroup.push(conversation)
  return conversationGroup
}

console.log(parseDialogTree(d0))