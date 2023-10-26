import React, { useState } from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function QuestionCard({
  text,
  index,
  setQuestionView,
  question,
  setShowOverlay,
}) {
  const [showMore, setShowMore] = useState(false)
  const player = usePlayer()

  function handleShowMore(event) {
    event.preventDefault()
    event.stopPropagation()
    console.log("show more clicked")
    setShowMore(!showMore)
  }

  function handleClick(event) {
    event.preventDefault()
    console.log("clicked")
    setQuestionView(index)
    console.log(index)
    setShowOverlay(false)
  }
  if (!player) {
    return null
  }

  const html = question.moreDetails
  return (
    <div
      className="flex flex-col border border-solid rounded shadow bg-gray-100 py-2 px-4 hover:bg-white hover:cursor-pointer"
      onClick={(e) => handleClick(e)}
    >
      <h1 className="text-left">Question {index + 1}</h1>
      <div className="flex flex-wrap">
        <h2 className="text-left">{question.question}</h2>
        <p
          className="rounded p-1 text-black hover:text-gray-500 hover:bg-gray-200 hover:cursor-pointer ml-4"
          onClick={(e) => handleShowMore(e)}
        >
          <strong>[show {showMore ? "less" : "more"}]</strong>
        </p>
      </div>
      {/* {showMore && <Markdown>{mkdwn}</Markdown>} */}
      {/* {showMore && <div dangerouslySetInnerHTML={{ __html: html }} />} */}
      {showMore && <p>{html}</p>}
    </div>
  )
}
