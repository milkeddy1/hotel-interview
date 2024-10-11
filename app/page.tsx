"use client"
import CustomInputNumber from "@/components/CustomInputNumber"
import RoomAllocation from "@/containers/RoomAllocation"
import Image from "next/image"
import { useState } from "react"

const rooms = [
  { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
  { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 },
]

const guest = { adult: 5, child: 5 }

export default function Home() {
  return (
    <div className="p-10 bg-white">
      <RoomAllocation
        guest={guest}
        rooms={rooms}
        onChange={(result) => {
          console.log(result, "result")
        }}
      />
    </div>
  )
}
