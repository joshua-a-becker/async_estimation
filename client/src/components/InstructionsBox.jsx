import React, { useState, useEffect } from "react"
import { usePlayer, useGame } from "@empirica/core/player/classic/react"
import { Game } from "../Game"

export function InstructionsBox({
  isMobile,
  setShowInstructions,
  setQuestionView,
}) {
  const player = usePlayer()
  const game = useGame()
  if (!player | !game) {
    return
  }

  function handleClick(event) {
    setQuestionView(event.target.value)
  }

  return (
    <div
      className={`absolute bg-white ${
        isMobile ? "top-75px left-75px w-250px" : "top-1/3 right-1/3 w-400px"
      } h-auto  block z-10 `}
    >
      <div className="min-h-max p-4 space-y-2 border-1 border-black border-solid rounded shadow flex flex-col">
        <div className="flex flex-wrap justify-between">
          <h1>Instructions: </h1>
          <button
            className="bg-red-500 py-1 px-2 bg-opacity-70 hover:bg-opacity-90 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
            onClick={() => setShowInstructions(false)}
          >
            X
          </button>
        </div>
        <p className="hyphens-auto">
          Instructions filler testing the length fo the bvox and how it hanfls
          really long
          instructionsinstructionsinstructionsinstructionsinstructionsinstructionsinstructions
        </p>
        <p className="break-all">Notifications will be sent to: {player.id}</p>
      </div>
      <div className="flex felx-wrap justify-around">
        {game.get("treatment").questions.map((_question, index) => {
          return (
            <button
              key={index}
              className="bg-gray-500 py-2 px-4 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value={index}
              onClick={(e) => handleClick(e)}
            >
              {index}
            </button>
          )
        })}
      </div>
    </div>
  )
}
