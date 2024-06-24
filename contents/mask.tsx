import cssText from "data-text:~/contents/style.css"
import './style.css';
import { useStorage } from "@plasmohq/storage/hook"
import type { MaskState } from '~type';
import { MASK_STORAGE } from "~common/storageKey";
import { useEffect, useState } from "react";
import React from "react";

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function Mask() {
  const [state, setState] = useStorage<Partial<MaskState>>(MASK_STORAGE, {})

  const [url, setUrl] = useState('')
  
  useEffect(() => {
    setUrl(window.location.href.split('?')[0])
  }, [])

  const isOpen = state.isOpen && state.tabIds.includes(url)

  return (
    <>
      {isOpen && (
        <div 
          className="fixed -top-1 -left-1 size-0" 
          style={{ 
            boxShadow: `55vmax 55vmax 0 55vmax rgba(0, 0, 0, ${state.opacity / 100})`
          }}
        >
        </div>
      )}
    </>
  )
}