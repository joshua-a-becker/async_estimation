import {
  useGame,
  usePlayer,
  usePlayers,
  useRound,
} from "@empirica/core/player/classic/react"
import React, { useState, useEffect } from "react"
import { Timer } from "./components/Timer"
import { CommentSubmit } from "./components/CommentSubmit"
import { EstimatePage } from "./components/EstimatePage"
import { IntroVotePage } from "./components/IntroVotePage"
import { GameScreen } from "./GameScreen"
import { GameScreenMobile } from "./GameScreenMobile"
import { Loading } from "@empirica/core/player/react"
import { IntroCommentSubmitPage } from "./components/IntroCommentSubmitPage"
import { EmailInput } from "./components/EmailInput"
import { Overlay } from "./components/Overlay"

export function Game() {
  const game = useGame()
  const players = usePlayers()
  const player = usePlayer()
  const round = useRound()

  const [isMobile, setIsMobile] = useState(false)

  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [emailMatch, setEmailMatch] = useState(true)
  const [questionView, setQuestionView] = useState(undefined)

  const [currentComment, setCurrentComment] = useState({})
  const [voted, setVoted] = useState(true)
  const [verified, setVerified] = useState(false)
  const [code, setCode] = useState("")

  const comments = game ? game.get("comments") : {}
  const seenComments = player ? player.get("seenComments") : {}
  const [showOverlay, setShowOverlay] = useState(false)

  function handleVerify(event) {
    event.preventDefault()
    if (!player) {
      return
    }

    const verificationCode = player.get("verificationCode")
    console.log(
      verificationCode,
      typeof verificationCode,
      verificationCode.length
    )
    console.log(code, typeof code, code.length)
    if (verificationCode.toString() !== code) {
      player.set("verfifiedStatus", false)
      return
    }

    player.set("verifiedStatus", true)
    player.set("sendMagicLink", true)
    player.set("join", true)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (nickname) {
      console.log("email check")

      player.set("introIndex", 0)
      player.set("gameStage", "game") //player.set("gameStage", "introEstimate")
      player.set("nickname", nickname)

      // player.set("join", true) for OLD version where they click join button
    }
  }

  const decipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0))
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code)
    return (encoded) =>
      encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("")
  }

  useEffect(() => {
    window.screen.width <= 1000 ? setIsMobile(true) : setIsMobile(false)
  }, [window.screen.width])

  function detectWindowSize() {
    window.innerWidth <= 1000 ? setIsMobile(true) : setIsMobile(false)
  }

  window.onresize = detectWindowSize

  useEffect(() => {
    if (!player) {
      return
    }
    const searchParams = new URL(document.location).searchParams
    const participantKey = searchParams.get("participantKey")
    const myDecipher = decipher("JBLab")
    const emailAddress = myDecipher(participantKey).split("^")[0]
    if (emailAddress.includes("@")) {
      player.set("emailAddress", emailAddress)
    }
    console.log(myDecipher(participantKey))

    // const nullParams = ["participantKey", "MID"]

    // const filterParams = Object.fromEntries(
    //   Object.entries(urlParams).filter(
    //     ([key, value]) => !nullParams.includes(key)
    //   )
    // )

    // player.set("filterKey", filterParams[0])
    // player.set("filterValue", filterParams[1])
  }, [])

  useEffect(() => {
    if (!player) {
      return
    }
    if (player.get("emailAddress") === undefined) {
      player.set("verifiedStatus", true)
      return
    }
    if (player.get("verificationCode")) {
      return
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000)
    const searchParams = new URL(document.location).searchParams
    console.log(searchParams)
    const encryptedId = searchParams.get("participantKey")
    console.log(encryptedId)
    player.set("encryptedId", encryptedId)
    console.log(player.get("encryptedId"))
    player.set("verificationCode", verificationCode)
    player.set("sendVerification", true)
  }, [])

  useEffect(() => {
    if (!player || !game) {
      return
    }

    if (questionView === undefined) {
      return
    }

    console.log(player.get("seenComments"))

    const seenCommentIds = player
      .get("seenComments")
      [`${questionView}`].map((_comment) => _comment.id)

    console.log(seenCommentIds)

    const commentsToVote = comments[`${questionView}`].filter(
      (_comment) => !seenCommentIds.includes(_comment.id)
    )
    if (!commentsToVote) {
      setCurrentComment({})
      return
    }

    if (!currentComment) {
      setCurrentComment(
        commentsToVote[Math.floor(Math.random() * commentsToVote.length)]
      )
      setVoted(false)

      return
    }

    if (voted) {
      setCurrentComment(
        commentsToVote[Math.floor(Math.random() * commentsToVote.length)]
      )
      setVoted(false)

      return
    }
  }, [seenComments, comments])

  if (!player.get("verifiedStatus")) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p>
          Please check your emails for your verification code and enter below
        </p>
        <input
          className="mb-5 appearance-none block px- py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
          type="number"
          id="inputEstimate"
          value={code}
          placeholder={`Enter your verification code`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick(e)
            }
          }}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="h-30px px-1 bg-gray-500 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          onClick={handleVerify}
        >
          Submit
        </button>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        {player.get("error") && <p>Error code: {player.get("errorCode")}</p>}
      </div>
    )
  }

  const treatment = game.get("treatment")
  const hasNickname = player.get("nickname")

  if (!hasNickname) {
    player.set("gameStage", "nickname")
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h3>Please enter your first name, or a nickname.</h3>
        <p>This is the name that other participants will see.</p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          <div className="ml-2 mt-2 space-y-1">
            <input
              className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              type="textarea"
              id="inputNickname"
              data-test="inputNickname"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          {player.get("emailContact") && (
            <EmailInput
              email={email}
              setEmail={setEmail}
              emailConfirm={emailConfirm}
              setEmailConfirm={setEmailConfirm}
              emailMatch={emailMatch}
            />
          )}
          <div className="flex space-x-1 justify-center items-center ">
            <button
              className="px-2 py-1 bg-teal-500 text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  }

  // if (player.get("gameStage") === "introEstimate") {
  //   return (
  //     <>
  //       <EstimatePage />
  //     </>
  //   )
  // }

  // if (player.get("gameStage") === "introVote") {
  //   return (
  //     <>
  //       <IntroVotePage />
  //     </>
  //   )
  // }

  // if (player.get("gameStage") === "introCommentSubmit") {
  //   return (
  //     <>
  //       <IntroCommentSubmitPage />
  //     </>
  //   )
  // }

  const isChat = treatment.communication === "chat"
  if (player.get("gameStage") === "game") {
    return (
      <div className="flex w-full h-full justify-center align-center">
        {questionView === undefined ? (
          <Overlay
            isMobile={isMobile}
            questionView={questionView}
            setQuestionView={setQuestionView}
            setShowOverlay={setShowOverlay}
          />
        ) : isMobile ? (
          <GameScreenMobile
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            isChat={isChat}
            questionView={questionView}
            setQuestionView={setQuestionView}
          />
        ) : (
          <GameScreen
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            isChat={isChat}
            questionView={questionView}
            setQuestionView={setQuestionView}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Loading />
      <p>We are here</p>
    </div>
  )
}
