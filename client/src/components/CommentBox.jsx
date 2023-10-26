import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"

export function CommentBox({ index }) {
  const game = useGame()
  const player = usePlayer()
  const [currentComment, setCurrentComment] = useState({})
  const [voted, setVoted] = useState(true)
  const comments = game ? game.get("comments") : {}
  const seenComments = player ? player.get("seenComments") : {}

  useEffect(() => {
    console.log("firing use effect to make intro comments")
    if (!player | !game) {
      return
    }

    if (player.get("introComments") !== undefined) {
      return
    }

    console.log(comments)
    console.log("game and player exsit")

    console.log(`game stage is ${player.get("gameStage")}`)

    if (!player.get("gameStage") === "introVote") {
      return
    }
    console.log("in intro")

    const nComments = game.get("treatment").numberPreComments
    console.log(
      "🚀 ~ file: CommentBox.jsx:28 ~ useEffect ~ nComments:",
      nComments
    )

    const prePropComments = Object.entries(comments).reduce(
      (accumulator, [key, value], index) => {
        console.log(key, value)
        return {
          ...accumulator,
          [index]: value.reduce((sub_accumulator, _comment) => {
            if (_comment.author === "prePopulated") {
              return [...sub_accumulator, _comment]
            }
            return sub_accumulator
          }, []),
        }
      },
      {}
    )

    console.log(prePropComments)

    // const prePropComments = comments.map((_comments, index) => {
    //   console.log(_comments)
    //   console.log(typeof _comments)
    //   return {
    //     [index]: _comments[`${index}`].reduce((accumulator, _comment) => {
    //       if (_comment.author === "prePopulated") {
    //         return [...accumulator, _comment]
    //       }
    //       return accumulator
    //     }, []),
    //   }
    // })

    console.log(
      "🚀 ~ file: CommentBox.jsx:48 ~ prePropComments ~ prePropComments:",
      prePropComments
    )

    const introComments = Object.entries(prePropComments).reduce(
      (accumulator, [key, value], index) => {
        console.log(value)
        let commentArray = value
        shuffleArray(commentArray)
        return {
          ...accumulator,
          [index]: commentArray.slice(0, nComments),
        }
      },
      {}
    )

    player.set("introComments", introComments)
    console.log(
      "🚀 ~ file: CommentBox.jsx:69 ~ useEffect ~ introComments:",
      introComments
    )
  }, [])

  useEffect(() => {
    if (!player || !game) {
      return
    }

    // console.log("firing effect comments to vote")
    // console.log(player.get("seenComments")[`${index}`])
    const seenCommentIds = player
      .get("seenComments")
      [`${index}`].map((_comment) => _comment.id)

    let useComments =
      player.get("gameStage") === "introVote"
        ? player.get("introComments")[`${index}`]
        : comments[`${index}`].slice()

    // console.log(`player stage is: ${player.get("gameStage")}`)
    // console.log(
    //   "🚀 ~ file: CommentBox.jsx:61 ~ useEffect ~ useComments:",
    //   useComments
    //)

    let commentsToVote = useComments.filter(
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

  useEffect(() => {
    if (!player || !game) {
      return
    }

    // console.log("firing effect comments to vote")
    // console.log(player.get("seenComments")[`${index}`])
    const seenCommentIds = player
      .get("seenComments")
      [`${index}`].map((_comment) => _comment.id)

    let useComments =
      player.get("gameStage") === "introVote"
        ? player.get("introComments")[`${index}`]
        : comments[`${index}`].slice()

    let commentsToVote = useComments.filter(
      (_comment) => !seenCommentIds.includes(_comment.id)
    )

    setCurrentComment(
      commentsToVote[Math.floor(Math.random() * commentsToVote.length)]
    )
    setVoted(false)
  }, [index])

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  function handleVote(event) {
    event.preventDefault()
    const vote = event.target.value

    const { no, uncertain, yes, ...thisComment } = currentComment

    let seenComments = player.get("seenComments")
    const previousComments = seenComments[`${index}`]
    const newComments = [
      ...previousComments,
      {
        ...thisComment,
        vote: vote,
      },
    ]

    seenComments[`${index}`] = newComments

    updateGameComments(index, currentComment, vote)

    player.set("seenComments", seenComments)
    setVoted(true)

    console.log(newComments)

    if (
      player.get("gameStage") === "introVote" &&
      newComments.length === game.get("treatment").numberPreComments
    ) {
      console.log("!!!!!!!!!!!!!!!!!Voted on all intro comments!!!!!!!!!!!!")
      player.set("gameStage", "introCommentSubmit")
    }
  }

  function updateGameComments(index, thisComment, vote) {
    let gameComments = game.get("comments")

    const questionComments = gameComments[`${index}`]

    const previousComments = questionComments.filter(
      (_comment) => _comment.id !== thisComment.id
    )

    console.log(previousComments)

    const currentComment = questionComments.find(
      (_comment) => _comment.id === thisComment.id
    )

    // console.log(currentComment)

    const newComments = [
      ...previousComments,
      {
        ...currentComment,
        [vote]: currentComment[vote] + 1,
      },
    ]

    gameComments[`${index}`] = newComments

    game.set("comments", gameComments)
  }

  if (!game || !player) {
    return "Loading comments..."
  }

  return (
    <div className="h-full border border-solid rounded shadow flex flex-col p-6 space-y-2">
      <h1 className="m-b-2">Comment: </h1>
      {currentComment && (
        <div className="h-4/5">
          <div className="m-4 h-auto max-h-2/3 border-solid rounded border">
            <p className="max-h-80px overflow-auto text-center">
              {currentComment.text}
            </p>
          </div>
          <div className="flex felx-wrap justify-around">
            <button
              className="bg-green-500 py-2 px-4 hover:bg-green-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value="agree"
              onClick={handleVote}
            >
              Agree
            </button>
            <button
              className="bg-gray-500 py-2 px-4 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value="uncertain"
              onClick={handleVote}
            >
              Uncertain
            </button>
            <button
              className="bg-red-500 py-2 px-4 hover:bg-red-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value="disagree"
              onClick={handleVote}
            >
              Disagree
            </button>
          </div>
        </div>
      )}
      {!currentComment && (
        <h1 className="m-b-2">
          You have voted on all comments, please wait for more or add your own
        </h1>
      )}
    </div>
  )
}
