import React from "react"
import { ChevronIcon } from "./SvgIcon"

export function ScrollButton({ handleClick }) {
  return (
    <div
      className="flex justify-center space-x-2 align-center text-center self-center items-center absolute w-250px h-40px text-white bg-gray-800 hover:bg-gray-600 rounded-2xl"
      onClick={handleClick}
    >
      <p className="my-auto align-middle ">Scroll to top</p>
      <ChevronIcon />
    </div>
  )
}
