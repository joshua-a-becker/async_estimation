import React from "react"
import { InfoIcon } from "./SvgIcon"

export function MobileBanner({
  view,
  setView,
  showOverlay,
  setShowOverlay,
  isMobile,
  scrollToTop,
}) {
  function handleClick(event) {
    event.preventDefault()
    const target = event.target.value
    setView(target)
    scrollToTop()
  }
  return (
    <div className="w-300px min-w-max justify-evenly fixed flex flex-wrap  row-start-1 col-start-1 row-span-1 p-y-1 col-span-1 bg-gray-800 border border-solid rounded">
      <button
        value="estimate"
        className={`p-x-2 p-y-1 rounded ${
          view === "estimate"
            ? "bg-gray-300 shadow shadow-gray-500 text-black"
            : "hover:bg-gray-600 bg-gray-800 text-white "
        }`}
        onClick={handleClick}
      >
        Other Estimates
      </button>
      <button
        value="comment"
        className={`p-x-2 p-y-1 rounded ${
          view === "comment"
            ? "bg-gray-300 shadow shadow-gray-500 text-black"
            : "hover:bg-gray-600 bg-gray-800 text-white"
        }`}
        onClick={handleClick}
      >
        Vote/Comment
      </button>
      <button
        value="social"
        className={`p-x-2 p-y-1 rounded ${
          view === "social"
            ? "bg-gray-300 shadow shadow-gray-500 text-black"
            : "hover:bg-gray-700 bg-gray-800 text-white"
        }`}
        onClick={handleClick}
      >
        Social
      </button>
      <InfoIcon
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        isMobile={isMobile}
      />
    </div>
  )
}
