import React, { useState, useEffect } from "react"
import {
  usePlayers,
  usePlayer,
  useGame,
} from "@empirica/core/player/classic/react"

export function MedianBox({ index }) {
  const players = usePlayers()
  const player = usePlayer()
  const game = useGame()
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    if (!game || !players) {
      return
    }

    const newAnswers = players.reduce((accumulator, _player) => {
      if (_player.get("currentEstimate")?.[`${index}`] !== undefined) {
        return [
          ...accumulator,
          parseInt(_player.get("currentEstimate")[`${index}`]),
        ]
      }
      return accumulator
    }, [])

    setAnswers(newAnswers)
  })

  useEffect(() => {
    if (!game || !players) {
      return
    }

    let medianObject = player.get("seenMedians") || {}

    const currentMedian = median(answers)

    medianObject[`${index}`] = currentMedian

    player.set("seenMedians", medianObject)
  }, [answers])

  function handleCheck() {
    // console.log(players)
    // const indexes = game.get("treatment").questions.reduce((acc, _q, index) => {
    //   return [...acc, index]
    // }, [])
    // console.log(game.get("gameMedians"))
    // })
  }

  // const [isLocked, setIsLocked] = useState(true)

  // useEffect(() => {
  //   if (!player) {
  //     return
  //   }

  //   if (!player.get("currentEstimate")) {
  //     return
  //   }

  //   const currentEstimate = player.get("currentEstimte")[`${index}`]
  //   currentEstimate !== undefined && setIsLocked(false)
  // }, [])

  function median(array) {
    const sorted = array.sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2
    }

    return sorted[middle]
  }

  if (!game || !player || !players) {
    console.log(players)
    console.log(game)
    console.log(player)
    return "Loading issues..."
  }

  const comments = game.get("comments")[`${index}`]
  const myComments = comments.filter(
    (_comment) => _comment.author === player.id
  )

  const myVotedComments = player.get("seenComments")[`${index}`]

  const requiredVotes = game.get("treatment").numberPreVotes
  const requiredComments = game.get("treatment").numberPreComments

  const currentEstimate = player.get("currentEstimate")?.[`${index}`]

  const isLocked =
    (myComments.length < requiredComments) |
    (myVotedComments.length < requiredVotes) |
    (currentEstimate === undefined)

  const otherPlayers = players.reduce((accumulator, _player) => {
    if (
      _player.get("currentEstimate") !== undefined &&
      _player.id !== player.id &&
      _player.get("nickname") !== undefined
    ) {
      return [...accumulator, _player]
    }
    return accumulator
  }, [])
  // could be otherAnswers = otherPlayers.reduce

  return (
    <div className="h-full p-4 flex flex-col space-y-2 border border-solid rounded shadow">
      <h1 onClick={(e) => handleCheck()}>
        Average (Median) Community Estimate:{" "}
      </h1>
      {isLocked ? (
        <div>
          <p>
            <strong>Unlock Social Features</strong>
          </p>
          {/* <strong>
              <ul>
                <lh>:</lh>
                {currentEstimate === undefined && <li>Enter and estimate</li>}
                {myComments.length < requiredComments && (
                  <li>
                    Enter {requiredComments - myComments.length} more comment
                    {requiredComments - myComments.length > 1 && "s"}
                  </li>
                )}
                {myVotedComments.length < requiredVotes && (
                  <li>
                    Vote on {requiredVotes - myVotedComments.length} more
                    comment
                    {requiredVotes - myVotedComments.length > 1 && "s"}
                  </li>
                )}
              </ul>
            </strong> */}
        </div>
      ) : (
        answers.length >= 1 && (
          <div className="bg-white border border-black border-solid rounded flex p-2 justify-center align-center">
            <p>{median(answers)}</p>
          </div>
        )
      )}
    </div>
  )
}
