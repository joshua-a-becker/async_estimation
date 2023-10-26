import React from "react"
import { usePlayer } from "@empirica/core/player/classic/react"
import { addBreaksToString } from "../../helperFunctions"

export function Message({ text, author, nickname, timeStamp, successive }) {
  const player = usePlayer()
  if (!player) {
    return null
  }

  function handleClick() {
    console.log(displayText, successive)
    console.log(new Date(timeStamp))
  }

  const isSender = author === player.id
  const messageDate = new Date(timeStamp)
  const isSystem = author === "system"

  let displayText = text
  // if (displayText.length > 20) {
  //   displayText = addBreaksToString(displayText, 20)
  // }

  if (isSystem) {
    return (
      <div className="px-2 py-1 flex flex-col w-9/10 self-center">
        <div className="p-4 min-h-max flex flex-col text-center text-gray-500">
          <span onClick={handleClick} className="break-words h-auto">
            {displayText}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`px-2 ${!successive && "py-1"} flex flex-col min-w-3/4 ${
        isSender ? "self-end" : "self-start"
      }`}
    >
      {!successive && (
        <p className="text-start mx-2 justify-self-start">{nickname}:</p>
      )}

      <div
        className={`p-4 min-h-max w-full flex flex-col border rounded text-left ${
          isSender ? "bg-green-100" : "bg-blue-100"
        }`}
      >
        <span
          onClick={handleClick}
          className={`break-words h-auto ${
            isSender ? "self-end" : "self-start"
          }`}
        >
          {displayText}
        </span>
        <p className="text-sm text-gray-500 justify-self-end self-end">
          {messageDate.toLocaleDateString()}: {messageDate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

//   return (
//     <div className="flex flex-col space-y-2">
//       <p className="text-start justify-self-start">{nickname}</p>
//       <div
//         className={`p-6 m-2 min-h-max w-3/5 flex flex-col border rounded ${
//           isSender
//             ? "self-end bg-green-100 text-right"
//             : "self-start bg-blue-100 text-left"
//         }`}
//       >
//         <span className="hyphens-auto">{text}</span>
//         <p className="text-sm text-gray-500 justify-self-end text-end">
//           {timeStamp}
//         </p>
//       </div>
//     </div>
//   )
// }
