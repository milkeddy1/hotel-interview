"use client"
import clsx from "clsx"
import React, { useRef, useState } from "react"
// 每個方塊寬  高 48px,間隔 8px,字型大小 16px,需具備 disabled 樣式
// 色碼可自訂。
// 需要跟原生 <input type=”number” /> 的行為相同,可用鍵盤輸入數字。
// 長按加減按鈕(非鍵盤按鈕)可以自動連續加減,數字變化需顯示。
// props 最少包含 min、max、step、name、value、onChange、onBlur 跟disabled
// 驗證將會取用實作好的 CustomInputNumber 調整輸入的 props ,檢查 onChange 跟 onBlur 的原生 Event.target 是否正確,至少要可以取得Event.target.name 跟 Event.target.value。如下:

type Props = {
  min: number
  max: number
  step: number
  name: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
  canAdd: boolean
  canSubtract?: boolean
}

export default function CustomInputNumber({
  min,
  max,
  step,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  canAdd,
  canSubtract = true,
}: Props) {
  const intervalRef = useRef<null | NodeJS.Timeout>(null) // 儲存 interval 的參考
  const timeoutRef = useRef<null | NodeJS.Timeout>(null) // 儲存 timeout 的參考
  const inputRef = useRef<HTMLInputElement>(null)

  // 按住時開始快速增減，500ms 後觸發
  const handleMouseDown = (action: () => void, type: "add" | "subtract") => {
    if (disabled) {
      return
    }

    if ((value + step > max && type === "add") || (!canAdd && type === "add")) {
      return
    }

    if (value - step < min && type === "subtract") {
      return
    }

    action()

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 50) // 每 100ms 執行一次
    }, 500)
  }

  // button onclick trigger input onchange
  const btnOnClickOnChange = (num: number) => {
    if (inputRef.current) {
      inputRef.current.value = num.toString()
      const event = {
        target: inputRef.current,
        currentTarget: inputRef.current,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
  }

  // 停止快速增減
  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef?.current) // 清除快速增減的 interval
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef?.current) // 清除 500ms 的等待
    }
  }

  const handleOnBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    if (!e) {
      if (inputRef.current) {
        // 模擬點擊輸入框以觸發其 onBlur 事件
        inputRef.current.focus()
        inputRef.current.blur()
      }
    }
  }

  const addButtonStyle = clsx(
    "w-[48px] h-[48px] text-[32px] rounded-[4px] text-center border flex items-center justify-center",
    disabled || !canAdd
      ? "hover:cursor-not-allowed border-slate-200"
      : "active:bg-slate-200 hover:bg-slate-100 border-[#FFAD86]",
  )
  const subtractButtonStyle = clsx(
    "w-[48px] h-[48px] text-[32px] rounded-[4px] text-center border flex items-center justify-center",
    disabled ? "hover:cursor-not-allowed border-slate-200" : "active:bg-slate-200 hover:bg-slate-100 border-[#FFAD86]",
  )

  const inputStyle = clsx(
    "w-[48px] h-[48px] rounded-[4px] bg-transparent border text-center",
    disabled ? "cursor-not-allowed border-gray-100" : "border-gray-300",
  )

  const buttonTextStyle = clsx("text-[#FFAD86] text-[32px] leading-[32px]", disabled ? "text-slate-400" : "")

  return (
    <div className="text-[16px] flex gap-[8px]">
      <button
        onBlur={() => {
          handleOnBlur()
        }}
        className={subtractButtonStyle}
        onMouseDown={() =>
          handleMouseDown(() => {
            btnOnClickOnChange(-step)
          }, "subtract")
        }
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={disabled}
      >
        <p className={buttonTextStyle}>-</p>
      </button>

      <input
        className={inputStyle}
        type="number"
        min={min}
        max={max}
        step={step}
        name={name}
        value={value}
        onChange={(e) => {
          console.log("input oncahnge triggered")

          if (Number(e.target.value) > max) {
            return
          }
          if (Number(e.target.value) < min) {
            return
          }

          onChange(e)
        }}
        onBlur={(e) => {
          onBlur(e)
        }}
        ref={inputRef}
        disabled={disabled}
      />
      <button
        onBlur={() => {
          handleOnBlur()
        }}
        className={addButtonStyle}
        onMouseDown={() =>
          handleMouseDown(() => {
            btnOnClickOnChange(step)
          }, "add")
        }
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 滑鼠移開按鈕時也停止
      >
        <p className={buttonTextStyle}>+</p>
      </button>
    </div>
  )
}
