import cssText from "data-text:~/contents/style.css"
import './style.css';
import { useStorage } from "@plasmohq/storage/hook"
import type { MaskState } from '~type';
import { MASK_STORAGE } from "~common/storageKey";
import { useEffect, useState } from "react";
import React from "react";
import { isIncludesId } from "~utils/tab";
import { rangeOpacity } from "~utils/range";

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function Mask() {
  const [state, setState] = useStorage<Partial<MaskState>>(MASK_STORAGE, {})

  const [url, setUrl] = useState('')

  useEffect(() => {
    const hostUrl = window.location.host
    setUrl(hostUrl)

    const changeOpacity = (v: number) => {
      setState(data => {
        if(!data.isOpen) return data
        data.opacity = rangeOpacity(data.opacity + v)
        return { ...data }
      })
    }

    const onKeyDown = (e: KeyboardEvent) => {
      // e.metaKey: true 代表 Mac command
      const isCtrlAndShift = e.ctrlKey && e.shiftKey
      if(isCtrlAndShift && (e.key === 'm' || e.key === 'M')) {
        setState(data => {
          if(!isIncludesId(hostUrl, data.tabIds)) {
            if(!data.tabIds) data.tabIds = []
            data.tabIds.push(hostUrl)
            data.isOpen = true
          } else {
            data.isOpen = !data.isOpen
          }
          return { ...data }
        })
      } else if(isCtrlAndShift) {
        if(e.key === '=' || e.key === '+') {
          changeOpacity(10)
        } else if(e.key === '-' || e.key === '_') {
          changeOpacity(-10)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  }, [])

  const isOpen = state.isOpen && isIncludesId(url, state.tabIds)

  return (
    <>
      {isOpen && (
        <div 
          className="fixed -top-1 -left-1 size-0 transition-all z-[999999]" 
          style={{ 
            boxShadow: `55vmax 55vmax 0 55vmax rgba(0, 0, 0, ${state.opacity / 100})`
          }}
        >
        </div>
      )}
    </>
  )
}