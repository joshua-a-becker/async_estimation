import { EmpiricaClassic } from "@empirica/core/player/classic"
import { EmpiricaContext } from "@empirica/core/player/classic/react"
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react"
import React from "react"
import { Game } from "./Game"
import { ExitSurvey } from "./intro-exit/ExitSurvey"
import { Introduction } from "./intro-exit/Introduction"
import { NewPlayer } from "./intro-exit/NewPlayer"

export default function App() {
  const urlParams = new URLSearchParams(window.location.search)
  const playerKey = urlParams.get("participantKey") || ""

  const { protocol, host } = window.location
  const url = `${protocol}//${host}/query`

  function introSteps({ game, player }) {
    return [Introduction]
  }

  function exitSteps({ game, player }) {
    return [ExitSurvey]
  }
  // TODO create a separate playerCreate page that just has the email, then swap to NewPlayer when playerKey has a value!!!

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext
            playerCreate={NewPlayer}
            unmanagedAssignment
            disableNoGames
            disableConsent
            exitSteps={exitSteps}
          >
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  )
}
