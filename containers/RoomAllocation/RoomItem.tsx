import CustomInputNumber from "@/components/CustomInputNumber"
import { useState } from "react"

type Props = {
  roomPrice: number
  adultPrice: number
  childPrice: number
  capacity: number
  onChange: (type: "adult" | "child", number: number) => void
  canAddAdult: boolean
  canAddChild: boolean
}

export default function RoomItem({ capacity, onChange, canAddAdult, canAddChild }: Props) {
  const [adultNumber, setAdultNumber] = useState(0)
  const [childNumber, setChildNumber] = useState(0)

  const handleAdultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, "e.target.value")

    setAdultNumber((prev) => prev + +e.target.value)
    onChange("adult", Number(e.target.value))
  }

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChildNumber((prev) => prev + +e.target.value)
    onChange("child", Number(e.target.value))
  }
  const totalMemberAmount = adultNumber + childNumber

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-bold text-lg">房間：{totalMemberAmount}人</h2>

      <div className="flex flex-col gap-4">
        {/* 大人 */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h3>大人</h3>
            <p className="text-neutral-400">年齡 20+</p>
          </div>
          <CustomInputNumber
            min={0}
            max={capacity - childNumber}
            step={1}
            name="adult"
            value={adultNumber}
            onChange={handleAdultChange}
            onBlur={(e) => console.log(e.target.name, e.target.value)}
            canAdd={canAddAdult}
          />
        </div>
        {/* 小孩 */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h3>小孩</h3>
          </div>
          <CustomInputNumber
            min={0}
            max={capacity - adultNumber}
            step={1}
            name="child"
            value={childNumber}
            onChange={handleChildChange}
            onBlur={(e) => console.log(e)}
            canAdd={canAddChild}
          />
        </div>
      </div>

      {/* divider */}
      <div className="border-b border-slate-200"></div>
    </div>
  )
}
