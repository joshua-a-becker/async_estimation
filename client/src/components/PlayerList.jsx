import React from "react"
import { usePlayers, usePlayer } from "@empirica/core/player/classic/react"
import { PlayerCard } from "./PlayerCard"

export function PlayerList({ index }) {
  const players = usePlayers()
  const player = usePlayer()

  if (!player || !players) {
    return "Loading..."
  }

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

  const otherAnswers = otherPlayers.reduce((accumulator, _player) => {
    if (_player.get("currentEstimate") !== undefined) {
      return [...accumulator, _player.get("currentEstimate")[`${index}`]]
    }
    return accumulator
  }, [])

  const mean =
    otherAnswers.reduce(
      (accumulator, answer) => accumulator + parseInt(answer),
      0
    ) / otherAnswers.length

  return (
    <div className="h-full p-4 flex flex-col space-y-2 border border-solid rounded shadow">
      <h1>Other Players: </h1>
      {otherAnswers.length >= 1 && (
        <div className="bg-white border border-black border-solid rounded flex flex-wrap p-6 justify-between">
          <p>Average:</p>
          <p>{mean}</p>
        </div>
      )}
      <div className="bg-gray-100 h-full flex flex-col space-y-2 border border-solid rounded shadow">
        {otherPlayers.map((_player, _index) => (
          <PlayerCard
            key={_index}
            name={_player.get("nickname")}
            estimate={_player.get("currentEstimate")[`${index}`]}
          />
        ))}
      </div>
    </div>
  )
}
