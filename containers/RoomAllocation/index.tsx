"use client"

import { useEffect, useState } from "react"
import RoomItem from "./RoomItem"
import getDefaultRoomAllocation from "@/app/utils/getDefaultRoomAllocation"

type Props = {
  guest: { adult: number; child: number }
  rooms: { roomPrice: number; adultPrice: number; childPrice: number; capacity: number }[]
  onChange: (result: { adult: number; child: number; price: number }[]) => void
}

export default function RoomAllocation({ guest, rooms, onChange }: Props) {
  const [distributedGuest, setDistributedGuest] = useState({
    adult: 0,
    child: 0,
  })
  const [result, setResult] = useState<{ adult: number; child: number; price: number }[]>(
    getDefaultRoomAllocation({ guest, rooms }),
  )

  const handleGuestChange = (type: "adult" | "child", number: number) => {
    setDistributedGuest((prev) => {
      return {
        ...prev,
        [type]: prev[type] + number,
      }
    })
  }
  const canAddAdult = distributedGuest.adult < guest.adult
  const canAddChild = distributedGuest.child < guest.child
  const adult = guest.adult - distributedGuest.adult
  const child = guest.child - distributedGuest.child

  useEffect(() => {
    onChange(result)
  }, [])

  return (
    <div className="m-4 flex flex-col gap-4">
      {/* title */}
      <h2 className="text-xl font-bold">
        住客人數：{guest.adult}位大人，{guest.child}位小孩/{rooms.length}房
      </h2>

      {/* alert */}
      <div className="bg-[#e6f4ff] border border-[#91caff] p-6 rounded-md">
        <p>
          尚未分配人數：{adult}位大人，{child}位小孩
        </p>
      </div>

      {/* rooms */}
      {rooms.map((room, idx) => {
        return (
          <RoomItem
            key={idx}
            {...room}
            onChange={handleGuestChange}
            canAddAdult={canAddAdult}
            canAddChild={canAddChild}
          />
        )
      })}
    </div>
  )
}
