import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react"
import { Loading } from "@empirica/core/player/react"
import { TextBox } from "./TextBox"
import { CommentBox } from "./CommentBox"

export function IntroVotePage() {
  const game = useGame()
  const player = usePlayer()

  if (!game | !player) {
    return (
      <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Loading />
        Intro Vote
      </div>
    )
  }

  const index = player.get("introIndex") || 0

  return (
    <div className="h-9/10 p-y-20 flex flex-col space-y-10 justify-center4">
      <div className="flex min-h-max w-400px self-center">
        <TextBox type="Question" index={index} />
      </div>
      <div className="min-h-max w-400px self-center">
        <TextBox type="Instructions" index={index} />
      </div>
      <div className="h-300px w-400px self-center">
        <CommentBox index={index} />
      </div>
    </div>
  )
}
