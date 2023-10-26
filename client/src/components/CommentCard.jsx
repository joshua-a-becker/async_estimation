import React from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function CommentCard({
  comment,
  agree,
  uncertain,
  disagree,
  personal,
  commentId,
  index,
}) {
  const player = usePlayer()

  if (!player) {
    return null
  }

  const seenComments = player.get("seenComments")[`${index}`]

  const myVote =
    seenComments.find((_comment) => _comment.id === commentId)?.vote || ""

  return (
    <div className="flex flex-col border border-solid rounded shadow">
      <p className="max-h-100px self-left text-left overflow-auto p-4 m-auto">
        {comment}
      </p>
      <div className="justify-evenly flex flex-wrap p-b-2">
        <p
          className={`${
            myVote === "agree" &&
            "bg-green-500 px-2 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          }`}
        >
          Agree: {agree || 0}
        </p>
        <p
          className={`${
            myVote === "uncertain" &&
            "bg-gray-500 px-2 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          }`}
        >
          Uncertain: {uncertain || 0}
        </p>
        <p
          className={`${
            myVote === "disagree" &&
            "bg-red-500 px-2 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          }`}
        >
          Disagree: {disagree || 0}
        </p>
      </div>
    </div>
  )
}
