import React from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"
import { Message } from "./Message"
import { useEffect, useRef } from "react"

export function ChatRoom({ index }) {
  const game = useGame()
  const player = usePlayer()
  const players = usePlayers()

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const messages = game.get("messages")?.[`${index}`] || []

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!player || !game) {
      return
    }
    const questions = game.get("treatment").questions
    let lastSeenObj =
      player.get("lastSeenMessages") ||
      questions.reduce((acc, _question, index) => {
        return { ...acc, [index]: undefined }
      }, {})

    const lastSeen = lastSeenObj[`${index}`] || undefined

    const latestMessage = messages[messages.length - 1] || undefined

    if (latestMessage === undefined) {
      return
    }

    if (lastSeen === undefined) {
      lastSeenObj[`${index}`] = latestMessage
      console.log(lastSeenObj)

      player.set("lastSeenMessages", lastSeenObj)
      return
    }
    const match =
      lastSeen.author === latestMessage.author &&
      lastSeen.timeStamp === latestMessage.timeStamp

    if (!match) {
      lastSeenObj[`${index}`] = latestMessage
      console.log(lastSeenObj)

      player.set("lastSeenMessages", lastSeenObj)
    }
  }, [messages])

  if (!game) {
    return null
  }

  // const sortedMessages = messages.sort((a, b) => a.timeStamp < b.timeStamp)

  const sortedMessages = messages

  function handleCheck() {
    console.log(players)
    const indexes = game.get("treatment").questions.reduce((acc, _q, index) => {
      return [...acc, index]
    }, [])

    players.forEach((_player) => {
      const _lastSeenObj = _player.get("lastSeenMessages")
      const gameMessages = game.get("messages")
      console.log("game messages", gameMessages)
      console.log(_player.get("nickname"), _lastSeenObj)
      const unreadObj = indexes.reduce((_acc, idx) => {
        const _lastMessage = _lastSeenObj ? _lastSeenObj[idx] : undefined
        console.log(_lastMessage)
        if (_lastMessage === undefined) {
          return [..._acc, true]
        }
        const unreadMessages = game
          .get("messages")
          ?.[`${idx}`].filter(
            (_message) => _message.timeStamp > _lastMessage.timeStamp
          )

        console.log(unreadMessages)

        if (unreadMessages.length > 0) {
          return [..._acc, true]
        }

        return [..._acc, false]
      }, [])

      console.log("unread messages", unreadObj)
    })
  }

  return (
    <div className="h-4/5 min-h-100px flex flex-col space-y-2 border rounded shadow bg-gray-100 overflow-auto snap-end">
      {sortedMessages.map((_message, i, arr) => (
        <Message
          key={i}
          text={_message.text}
          author={_message.author}
          timeStamp={_message.timeStamp}
          nickname={_message.nickname}
          successive={i > 0 ? _message.author === arr[i - 1].author : false}
        />
      ))}
      <div ref={messagesEndRef} />
      <button onClick={(e) => handleCheck()}>check seen messages</button>
    </div>
  )
}
