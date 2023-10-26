import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"

export function CommentSubmit({ index }) {
  const [comment, setComment] = useState("")
  const player = usePlayer()
  const game = useGame()

  function handleSubmit(event) {
    event.preventDefault()

    if (comment.trim().length === 0) {
      console.log("whitespace only")
      return
    }

    console.log(comment)

    let gameComments = game.get("comments")

    const prevComments = gameComments[`${index}`]
    const newComments = [
      ...prevComments,
      {
        id:
          player.get("nickname") +
          "_" +
          Math.random().toString(36).substring(2, 15),
        text: comment,
        timeStamp: new Date().getTime(),
        author: player.id,
        agree: 0,
        disagree: 0,
        uncertain: 0,
      },
    ]

    setComment("")

    gameComments[`${index}`] = newComments

    game.set("comments", gameComments)
    // game.append("messages", {
    //   text: message,
    //   timeStamp: new Date(TimeSync.serverTime(null, 1000)),
    //   author: player.get("nickname")
    // })

    if (player.get("gameStage") === "introCommentSubmit") {
      const myComments = newComments.filter(
        (_comment) => _comment.author === player.id
      )
      console.log(
        "🚀 ~ file: CommentSubmit.jsx:51 ~ handleSubmit ~ myComments:",
        myComments
      )

      console.log(index, game.get("treatment").questions.length)

      if (myComments.length >= 2) {
        if (index < game.get("treatment").questions.length - 1) {
          player.set("introIndex", player.get("introIndex") + 1)
          player.set("gameStage", "introEstimate")
          return
        }
        player.set("gameStage", "game")
      }
    }
  }

  return (
    <div className="h-full border-solid rounded border shadow flex flex-col p-6 space-y-2">
      <h1 className="m-b-2">Comment Submit: </h1>

      <div className="flex flex-col space-y-2">
        <div className="w-full h-auto min-h-max p-2 border border-transparent xl:text-lg rounded text-sm font-medium rounded leading-snug">
          <textarea
            type="text"
            className=" p-4 w-full " //px-0 resize-none xl:text-lg text-md text-gray-500 bg-transparent placeholder-gray-300 border rounded leading-snug p-4"
            id="comment-input"
            name="comment"
            placeholder="...type your comment here"
            value={comment}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e)
              }
            }}
            onChange={(e) => setComment(e.target.value)}
            autoComplete="off"
          ></textarea>
        </div>
        <div className="flex flex-wrap justify-end">
          <button
            type="submit"
            className="w-1/3 flex text-center justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
