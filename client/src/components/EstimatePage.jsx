import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
  useStage,
  useRound,
} from "@empirica/core/player/classic/react"
import { Loading } from "@empirica/core/player/react"
import { TextBox } from "./TextBox"
import { EstimateSubmit } from "./EsimateSubmit"

export function EstimatePage() {
  const game = useGame()
  const player = usePlayer()

  if (!game | !player) {
    //what does this do?? TODO
    return (
      <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Loading />
        Esimtate Page
      </div>
    )
  }

  const index = player.get("introIndex") || 0
  return (
    <div>
      <div className="h-9/10 p-y-20 flex flex-col space-y-10 justify-center">
        <div className="flex min-h-max w-400px self-center">
          <TextBox type="Question" index={index} />
        </div>
        <div className="h-300px w-400px self-center">
          <EstimateSubmit index={index} />
        </div>
      </div>
    </div>
  )
}
