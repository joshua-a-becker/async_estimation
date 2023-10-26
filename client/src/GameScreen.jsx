import React, { useEffect, useState, useRef } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { TextBox } from "./components/TextBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { CommentBox } from "./components/CommentBox"
import { CommentSubmit } from "./components/CommentSubmit"
import { CommentList } from "./components/CommentList"
import { Chat } from "./components/Chat"
import { InfoIcon } from "./components/SvgIcon"
import { InstructionsBox } from "./components/InstructionsBox"
import { Overlay } from "./components/Overlay"
import { MedianBox } from "./components/MedianBox"
import { ScrollButton } from "./components/ScrollButton"
import { usePlayer } from "@empirica/core/player/classic/react"

export function GameScreen({
  showOverlay,
  setShowOverlay,
  isChat,
  questionView,
  setQuestionView,
}) {
  const player = usePlayer()
  const [hasScrolled, setHasScrolled] = useState(false)

  const scrollRef = useRef(null)

  const scrollToTop = () => {
    scrollRef.current.scroll({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    scrollRef.current.scrollTop === 0
      ? setHasScrolled(false)
      : setHasScrolled(true)
  }

  const handleScrollDebug = () => {
    console.log(scrollRef.current.scrollTop)
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Loading />
      </div>
    )
  }

  isChat = true
  return (
    <div className="relative h-full w-full justify-center align-center">
      <div
        className={`h-full max-h-12/13 min-h-screen-md grid gap-4 grid-cols-11 grid-rows-15 m-4 ${
          showOverlay && "opacity-20 pointer-events-none"
        }`}
      >
        <div className="row-start-1 col-start-1 row-span-2 col-span-3">
          <CurrentEstimate index={questionView} />
        </div>
        <div className="row-start-3 col-start-1 row-span-2 col-span-3">
          <MedianBox index={questionView} />
        </div>
        <div className="row-start-5 col-start-1 row-span-11 col-span-3">
          {isChat ? (
            <Chat index={questionView} />
          ) : (
            <PlayerList index={questionView} />
          )}
        </div>
        <div
          className="col-start-4 col-span-5 space-y-4 row-start-1 row-span-15 overflow-auto"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {/* <div ref={scrollToTopRef} /> */}

          {hasScrolled && (
            <div className="row-start-1 col-start-4 flex justify-center align-center">
              <ScrollButton handleClick={scrollToTop} />
            </div>
          )}
          <div className="row-start-1 col-start-4 row-span-4 col-span-5">
            <CommentBox index={questionView} />
          </div>
          <div className="row-start-4 row-span-4 col-start-4 col-span-5">
            <CommentSubmit index={questionView} />
          </div>
          <div className="row-start-8 col-start-4 row-span-13 col-span-5">
            <CommentList index={questionView} />
          </div>
        </div>
        <div className="row-start-1 col-start-9 row-span-1 col-span-3 flex">
          <InfoIcon
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            username={player.get("nickname")}
          />
        </div>
        <div className="row-start-2 col-start-9 row-span-13 col-span-3">
          <TextBox type="Question" index={questionView} />
        </div>
      </div>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setQuestionView={setQuestionView}
          isMobile={false}
          questionView={questionView}
        />
      )}
    </div>
  )
}
