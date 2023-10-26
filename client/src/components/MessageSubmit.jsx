import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"
import { SendIcon } from "./SvgIcon"

export function MessageSubmit({ index }) {
  const game = useGame()
  const player = usePlayer()
  const [newMessage, setNewMessage] = useState({})

  if (!game || !player) {
    return "Loading..."
  }

  function handleChange(event) {
    setNewMessage({
      text: event.target.value,
      author: player.id,
      nickname: player.get("nickname") || "??",
      timeStamp: new Date().getTime(),
    })
  }

  function handleSubmit() {
    if (!newMessage.text) {
      return
    }
    let allMessages = game.get("messages") || []
    const messages = allMessages[`${index}`] || []
    const newMessages = [...messages, newMessage]

    allMessages[`${index}`] = newMessages
    console.log(document.getElementById("message-submit").value)
    document.getElementById("message-submit").value = ""
    console.log(document.getElementById("message-submit").value)
    setNewMessage({})
    game.set("messages", allMessages)
  }

  return (
    <div className="flex flex-wrap justify-evenly items-center">
      <div className="p-2 h-auto border border-transparent rounded text-sm font-medium">
        <textarea
          className="p-1 w-350px h-min max-h-100px border rounded"
          id="message-submit"
          value={newMessage.text || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }

            if (e.key === "Enter" && e.shiftKey) {
              setNewMessage({ ...newMessage, text: newMessage.text + "\n" })
            }
          }}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="w-40px h-40px">
        <button
          type="submit"
          className="flex text-center border border-transparent rounded text-sm font-medium text-white bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
          onClick={handleSubmit}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}
