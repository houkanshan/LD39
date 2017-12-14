declare function require(name:string)

import { ConversationType } from './enums'
import { getRandom } from './utils'

const begin = require('./data/dialog/begin.csv')
const end = require('./data/dialog/end.csv')
const succeeded123 = require('./data/dialog/1-3-succeeded.csv')
const failed123 = require('./data/dialog/1-3-failed.csv')
const succeeded4 = require('./data/dialog/4-succeeded.csv')
const failed4 = require('./data/dialog/4-failed.csv')
const succeededSpicy = require('./data/dialog/spicy-succeeded.csv')
const failedSpicy = require('./data/dialog/spicy-failed.csv')
const failedTooSpicy = require('./data/dialog/too-spicy-failed.csv')

const speakerMap = {
  A: 0, a: 0,
  B: 1, b: 1,
  C: 2, c: 2,
}

interface Sentence {
  speakerIndex: number,
  text: string,
}
type Conversation = Array<Sentence>

function parseConversations(table): Array<Conversation> {
  const conversationGroup: Array<Conversation> = []
  let conversation: Conversation = []
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

const dialogsGroup = {
  begin: { used: [], conversations: parseConversations(begin) },
  end: { used: [], conversations: parseConversations(end) },
  succeeded123: { used: [], conversations: parseConversations(succeeded123) },
  failed123: { used: [], conversations: parseConversations(failed123) },
  succeeded4: { used: [], conversations: parseConversations(succeeded4) },
  failed4: { used: [], conversations: parseConversations(failed4) },
  succeededSpicy: { used: [], conversations: parseConversations(succeededSpicy) },
  failedSpicy: { used: [], conversations: parseConversations(failedSpicy) },
  failedTooSpicy: { used: [], conversations: parseConversations(failedTooSpicy) },
}

function choose(dialogs) {
  const conversation: Conversation = getRandom(dialogs.conversations, dialogs.used)
  dialogs.used.unshift(conversation)
  dialogs.used = dialogs.used.slice(0, 10)
  return conversation
}


export default function chooseConversation(
  type:ConversationType, dish, level, passed
) {
  if (type === ConversationType.START) {
    return choose(dialogsGroup.begin)
  }
  if (type === ConversationType.END) {
    return choose(dialogsGroup.end)
  }

  if (dish.pungency > 2) {
    return choose(dialogsGroup.failedTooSpicy)
  }
  if (dish.pungency > 0) {
    if (passed) {
      return choose(dialogsGroup.succeededSpicy)
    } else {
      return choose(dialogsGroup.failedSpicy)
    }
  }

  if (level < 3) {
    if (passed) {
      return choose(dialogsGroup.succeeded123)
    } else {
      return choose(dialogsGroup.failed123)
    }
  }

  // level === 4
  if (passed) {
    return choose(dialogsGroup.succeeded4)
  } else {
    return choose(dialogsGroup.failed4)
  }
}