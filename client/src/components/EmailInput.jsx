import React, { useState } from "react"

export function EmailInput({email, setEmail, emailConfirm, setEmailConfirm, emailMatch}) {
  return (
    <div className="h-full border-solid rounded border shadow flex flex-col p-6 space-y-2">

      <div className="flex flex-col space-y-2">
        <p>Please enter your email address:</p>
        <div className="w-full h-auto min-h-max p-2 border border-transparent xl:text-lg rounded text-sm font-medium rounded leading-snug">
          <input
            type="email"
            className=" p-4 w-full " //px-0 resize-none xl:text-lg text-md text-gray-500 bg-transparent placeholder-gray-300 border rounded leading-snug p-4"
            id="email-input"
            name="email"
            placeholder="...enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        {!emailMatch && <p className="text-red-500"><em>The email address entered does not match the one entered above.</em></p>}
        <p>Please re-enter your email address to confirm:</p>
        <div className="w-full h-auto min-h-max p-2 border border-transparent xl:text-lg rounded text-sm font-medium rounded leading-snug">
          <input
            type="email"
            className=" p-4 w-full " //px-0 resize-none xl:text-lg text-md text-gray-500 bg-transparent placeholder-gray-300 border rounded leading-snug p-4"
            id="emailConfirm-input"
            name="emailConfirm"
            placeholder="...confirm your email here"
            value={emailConfirm}
            onChange={(e) => setEmailConfirm(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}
