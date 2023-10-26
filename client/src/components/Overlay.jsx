import React, { useState, useEffect } from "react"
import { usePlayer, useGame } from "@empirica/core/player/classic/react"
import { TextBox } from "./TextBox"
import { QuestionCard } from "./QuestionCard"
import { EndDateBox } from "./EndDateBox"

export function Overlay({
  isMobile,
  setShowOverlay,
  setQuestionView,
  questionView,
}) {
  const player = usePlayer()
  const game = useGame()
  if (!player | !game) {
    return
  }

  function handleClick(event) {
    console.log("clicked")
    setQuestionView(event.target.value)
    console.log(event.target.value)
  }

  const isOverlay = questionView !== undefined

  return (
    <div
      className={`absolute flex flex-col p-6 space-y-20 bg-white my-1/20 mx-auto ${
        isMobile
          ? "top-1/20 left-1/20 w-4/5 min-w-380px h-auto"
          : "w-4/5 top-1/20 right-1/20 bottom-1/20 left-1/20"
      } ${
        isOverlay && "block z-10 object-center"
      } border-1 border-black border-solid rounded shadow overflow-auto`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-300px">
            <EndDateBox />
          </div>
          {isOverlay && (
            <button
              className={`bg-red-500  ${
                isMobile ? "w-20px h-20px text-sm" : "w-30px h-30px py-1"
              } bg-opacity-90 hover:bg-opacity-70 rounded border border-transparent rounded shadow-sm text-white flex justify-center align-center`}
              onClick={() => setShowOverlay(false)}
            >
              X
            </button>
          )}
        </div>
        <TextBox type="instructions" />
        {game.get("treatment").questions.map((_question, index) => {
          return (
            <QuestionCard
              key={index}
              question={_question}
              index={index}
              setShowOverlay={setShowOverlay}
              setQuestionView={setQuestionView}
            />
          )
        })}
      </div>
    </div>
  )
}
