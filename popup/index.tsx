import { useStorage } from "@plasmohq/storage/hook"
import "./style.css"
import { MASK_STORAGE } from "~common/storageKey"
import type { MaskState } from "~type"
import { getActiveTab } from "~utils/tab"
import { useEffect, useState } from "react"
import { handleUrl } from "~utils/url"
import React from "react"

const INIT_OPACITY = 40;

function rangeOpacity(newOpacity: number) {
  return Math.min(Math.max(Math.round(newOpacity), 0), 100);
}

function Button({className, ...props}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`font-medium px-3 py-1 rounded flex justify-center items-center transition-all text-gray-300 bg-zinc-600 hover:bg-zinc-500 hover:text-gray-200 cursor-pointer ${className}`} {...props}></div>
  )
}

function IndexPopup() {
  const [state, setState] = useStorage<MaskState>(MASK_STORAGE, {
    isOpen: false,
    tabIds: [],
    opacity: INIT_OPACITY,
    btnSize: 40
  })
  const progressRef = React.useRef<HTMLProgressElement>(null)
  const [url, setUrl] = useState('')

  const isUrlActive = state.tabIds.includes(url)

  useEffect(() => {
    getActiveTab().then((tab) => {
      setUrl(handleUrl(tab.url))
    })
  }, [])

  const onMouseDown = (event: MouseEvent) => {
    const progressW = progressRef.current.clientWidth
    const progressL = progressRef.current.offsetLeft
    const startOpacity = rangeOpacity((event.pageX - progressL) * 100 / progressW)
    const startX = event.pageX
    setState({ ...state, opacity: startOpacity })
  
    let timer = null
    function move(e: MouseEvent) {
      if(timer) return
      const changeX = e.pageX - startX
      const _opacity = rangeOpacity(startOpacity + changeX * 100 / progressW)
      setState({ ...state, opacity: _opacity })
      timer = setTimeout(() => {
        timer = null
      }, 60);
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', move)
    })
  }

  return (
    <div className="py-3 bg-black w-60">
      <div 
        className={`${!isUrlActive ? ' line-through' : ''} mx-2 pb-2 mb-2 text-gray-400 border-b border-indigo-500 border-solid hover:bg-gray-800 cursor-pointer`}
        onClick={() => {
          if(isUrlActive) {
            state.tabIds = state.tabIds.filter((item) => item !== url)
          } else {
            state.tabIds.push(url)
          }
          setState({ ...state })
        }}
      >
        <div>当前网站 ({isUrlActive ? '激活' : '未激活'})</div>
        <div className="text-ellipsis overflow-hidden text-nowrap">{url}</div>
      </div>
      <div className="flex items-center gap-3 px-4">
        <Button className="rounded-full w-6 h-6 p-0" onClick={() => setState({ ...state, opacity: state.opacity - 10 })}>-</Button>
        <progress 
          ref={progressRef}
          color="#3b70e8"
          className="progress flex-1 h-6 cursor-pointer rounded-sm"
          value={state.opacity} 
          max="100" 
          onMouseDown={onMouseDown as any}
        ></progress>
        <Button className="rounded-full w-6 h-6 p-0" onClick={() => setState({ ...state, opacity: state.opacity + 10 })}>+</Button>
      </div>
      <div className="text-indigo-500 text-medium font-bold text-center mt-2">{state.opacity}%</div>
      <div className="px-8 mt-2 mx-2 flex items-center justify-between">
        <Button 
          onClick={async () => {
            const isOpen = !state.isOpen
            if(isOpen) {
              if(!state.tabIds.includes(url)) {
                state.tabIds.push(url)
              }
            } else {
              state.tabIds = []
            }
            setState({ ...state, isOpen })
          }}
        >{state.isOpen ? "关闭" : "打开"}</Button>
        {/* <Button>移动</Button> */}
        <Button onClick={() => setState({ ...state, opacity: INIT_OPACITY })}>重置</Button>
      </div>
    </div>
  )
}

export default IndexPopup
