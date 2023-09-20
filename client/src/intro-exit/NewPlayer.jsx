import React, { useState, useEffect } from "react"
import { useCallback } from "react"
import { Loading } from "@empirica/core/player/react"

export function NewPlayer({ onPlayerID, connecting }) {
  const [enterEmail, setEnterEmail] = useState(true)
  const [tempEmail, setTempEmail] = useState("")
  const [email, setEmail] = useState("")
  const [partKeyId, setPartKeyId] = useState("")
  const [isMturk, setIsMturk] = useState(false)
  const [createPlayer, setCreatePlayer] = useState(false)

  useEffect(() => {
    const searchParams = new URL(document.location).searchParams
    const MID = searchParams.get("MID")
    const inviteCode = searchParams.get("inviteCode")
    const participantKey = searchParams.get("participantKey")

    console.log("firing first effect")

    if (participantKey || !inviteCode) {
      return
    }

    if (MID) {
      setEnterEmail(false)
      setIsMturk(true)
    }

    if (!isMturk && !email) {
      return
    }

    const id = MID ? MID + "^" + inviteCode : email + "^" + inviteCode
    const myCipher = cipher("JBLab")
    const encyptedId = myCipher(id)
    console.log(encyptedId)
    const url = new URL(window.location.href)
    url.searchParams.set("participantKey", encyptedId)
    url.searchParams.delete("inviteCode")
    window.history.replaceState(null, null, url)
    setPartKeyId(encyptedId)

    // window.location = `http://64.227.30.245:3000/?participantKey=${encyptedId}`
  }, [email])

  useEffect(() => {
    if (!onPlayerID || connecting) {
      return
    }

    if (createPlayer) {
      const searchParams = new URL(document.location).searchParams
      const participantKey = searchParams.get("participantKey")

      console.log(searchParams)

      console.log(`participant key: ${participantKey}`)

      if (!participantKey) {
        return // <Loading />
      }

      console.log(participantKey)

      if (participantKey) {
        console.log("attemtpting player join")
        onPlayerID(participantKey)
      }
    }

    setCreatePlayer(true)
  }, [partKeyId])

  const handleSubmit = (evt) => {
    evt.preventDefault()

    setEnterEmail(false)
    setEmail(tempEmail)
  }

  if (enterEmail) {
    return (
      <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Please enter your email
          </h2>
        </div>
        <div className="bg-white mt-6 w-500px self-center py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <fieldset disabled={connecting}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="playerID"
                    name="playerID"
                    type="text"
                    autoComplete="off"
                    required
                    autoFocus
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                  />
                  <p
                    className="mt-2 text-sm text-gray-500"
                    id="playerID-description"
                  ></p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-empirica-600 hover:bg-empirica-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
                >
                  Enter
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }

  const baseURL = "64.227.30.245:3000"
  return (
    <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md"></div>
      <div className="loader"></div>
      <p>
        {" "}
        Please see your {isMturk ? "Mturk messages" : "emails"} to find your
        personal link to log in. You may close this tab.
      </p>

      <p>{`${baseURL}/?participantKey=${partKeyId}`}</p>
    </div>
  )
}

const cipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0))
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2)
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code)

  return (text) =>
    text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("")
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
