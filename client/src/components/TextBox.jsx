import React, { useState, useEffect } from "react"
import { useGame } from "@empirica/core/player/classic/react"
import { useStageTimer } from "@empirica/core/player/classic/react"

export function TextBox({ type, index = null }) {
  const game = useGame()
  const [showMore, setShowMore] = useState(false)
  const timer = useStageTimer()

  // useEffect(() => {
  //   if (!timer) {
  //     return
  //   }
  //   let remaining = timer.remaining

  //   // if (timer?.remaining || timer?.remaining === 0) {
  //   //   remaining = Math.round(timer?.remaining / 1000);
  //   // }

  //   const nowSeconds = new Date().getTime()
  //   const nowDate = new Date(nowSeconds)
  //   const future = nowSeconds + remaining

  //   const eDate = new Date(future)
  //   setEndDate(eDate)
  // }, [])

  // if (!timer || !endDate) {
  //   return "Loading... no timer or end date"
  // }
  function handleShowMore(event) {
    event.preventDefault()
    event.stopPropagation()
    console.log("show more clicked")
    setShowMore(!showMore)
  }

  if (!game) {
    return "Loading... no game"
  }

  let text = "This is filler text. To be replaced!"

  if (type === "instructions") {
    return (
      <>
        <div className="h-full w-auto p-8 space-y-10 border border-solid rounded shadow flex flex-col">
          <h1>{type}: </h1>
          <p>{text}</p>
        </div>
      </>
    )
  }
  const treatment = game.get("treatment")
  const question = treatment.questions[index]
  text = question.question
  const html = question.moreDetails

  const endDate = new Date(game.get("treatment").endDate)

  return (
    <>
      <div className="min-h-max w-auto p-8 space-y-10 border border-solid rounded shadow flex flex-col">
        <h1>Question: </h1>
        <div className="flex flex-col">
          <p>{text}</p>
          {showMore && <div dangerouslySetInnerHTML={{ __html: html }} />}

          <p
            className="rounded p-1 max-w-max text-black hover:text-gray-500 hover:bg-gray-200 hover:cursor-pointer ml-4"
            onClick={(e) => handleShowMore(e)}
          >
            <strong>[show {showMore ? "less" : "more"}]</strong>
          </p>
        </div>
        <div className="flex justify-between">
          <h1>End Date: </h1>
          <p className="self-center">
            {endDate.toLocaleDateString("en-US", {
              month: "long",
            })}{" "}
            {endDate.getDate()}
            {", "}
            {`${endDate.getHours()}:${endDate.getMinutes()}`}
          </p>
        </div>
      </div>
    </>
  )
}
