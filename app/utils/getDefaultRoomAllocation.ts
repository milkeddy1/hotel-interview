import React from "react"

export default function getDefaultRoomAllocation({
  guest,
  rooms,
}: {
  guest: { adult: number; child: number }
  rooms: { roomPrice: number; adultPrice: number; childPrice: number; capacity: number }[]
}) {
  const { adult, child } = guest
  let minTotalPrice = Infinity
  let bestAllocation: {
    adult: number
    child: number
    price: number
  }[] = []
  function allocate(
    remainingAdults: number,
    remainingChildren: number,
    currentAllocation: {
      adult: number
      child: number
      price: number
    }[],
    currentPrice: number,
    roomIndex: number,
  ) {
    //

    if (remainingAdults === 0 && remainingChildren === 0) {
      if (currentPrice < minTotalPrice) {
        minTotalPrice = currentPrice
        bestAllocation = currentAllocation.map((room) => ({ ...room }))
      }
      return
    }

    if (roomIndex >= rooms.length) return

    const room = rooms[roomIndex]
    for (let adults = 0; adults <= Math.min(remainingAdults, room.capacity); adults++) {
      for (let children = 0; children <= Math.min(remainingChildren, room.capacity - adults); children++) {
        if (adults + children > 0 && adults + children <= room.capacity && (adults > 0 || children === 0)) {
          const roomPrice = room.roomPrice + adults * room.adultPrice + children * room.childPrice
          allocate(
            remainingAdults - adults,
            remainingChildren - children,
            [...currentAllocation, { adult: adults, child: children, price: roomPrice }],
            currentPrice + roomPrice,
            roomIndex + 1,
          )
        }
      }
    }

    allocate(remainingAdults, remainingChildren, currentAllocation, currentPrice, roomIndex + 1)
  }

  allocate(adult, child, [], 0, 0)
  return bestAllocation
}
