import React from 'react'

export function PlayerCard({name, estimate}) {
    return (
        <div className="flex flex-wrap border border-solid rounded m-l-6 m-r-6 gap-4 shadow justify-around">
            <p className="p-6 m-auto">{name}</p>
            <p className="p-6 m-auto">{estimate || "?"}</p>
        </div>
    )
}
