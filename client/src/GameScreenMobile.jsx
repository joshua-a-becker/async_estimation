import React, { useState, useRef } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { TextBox } from "./components/TextBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { CommentBox } from "./components/CommentBox"
import { CommentSubmit } from "./components/CommentSubmit"
import { CommentList } from "./components/CommentList"
import { Chat } from "./components/Chat"
import { MobileBanner } from "./components/MobileBanner"
import { InstructionsBox } from "./components/InstructionsBox"
import { Overlay } from "./components/Overlay"
import { MedianBox } from "./components/MedianBox"

export function GameScreenMobile({
  showOverlay,
  setShowOverlay,
  isChat,
  questionView,
  setQuestionView,
}) {
  const [view, setView] = useState("estimate") // Estimate | Comment | Social
  const scrollToTopRef = useRef(null)

  const scrollTop = () => {
    scrollToTopRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  isChat = true

  return (
    <div className="relative h-full w-full justify-center align-center">
      <div
        className={`min-w-320px max-w-350px overflow-auto flex flex-col m-4 align-center space-y-4 ${
          showOverlay && "opacity-20 pointer-events-none touch-none"
        }`}
      >
        <MobileBanner
          view={view}
          setView={setView}
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
          isMobile={true}
          scrollToTop={scrollTop}
        />
        <div ref={scrollToTopRef} />
        <br />
        <br />
        {view === "estimate" && (
          <>
            <TextBox type="Question" index={questionView} />
            <CurrentEstimate index={questionView} />
            <MedianBox index={questionView} />
          </>
        )}
        {view === "comment" && (
          <>
            <CommentBox index={questionView} />
            <CommentSubmit index={questionView} />
            <CommentList index={questionView} />
          </>
        )}
        {view === "social" && isChat && (
          <>
            <Chat index={questionView} />
          </>
        )}
        {view === "social" && !isChat && (
          <>
            <PlayerList index={questionView} />
          </>
        )}
      </div>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setQuestionView={setQuestionView}
          isMobile={true}
          questionView={questionView}
        />
      )}
    </div>
  )
}
