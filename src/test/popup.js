let opacity = 40;
const maskInfo = {x: 0, y: 0, size: 100, isMove: false}
const progress = document.querySelector('#progress')

progress.addEventListener('mousedown', (event) => {
  changeValue(event.offsetX * 100 / progress.clientWidth)
  const startX = event.pageX
  const startOpacity = opacity
  let timer = null
  function move(e) {
    const changeX = e.pageX - startX
    if(timer) return // 节流一下，防止触发太频繁
    changeValue(startOpacity + changeX * 100 / progress.clientWidth)
    timer = setTimeout(() => {
      timer = null
    }, 30);
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move)
  })
})

function changeValue(newOpacity) {
  let opacity2 = Math.min(Math.max(Math.round(newOpacity), 0), 100);
  progress.value = opacity2
  progressValue.textContent = opacity2
  opacity = opacity2
  const maskWrap = document.querySelector('#maskWrap')
  if(maskWrap) {
    // maskWrap.style.boxShadow = `0 0 0 100vmax rgba(0, 0, 0, ${opacity / 100})`
    maskWrap.style.setProperty('--opacity', opacity / 100)
  }
}

function openMaskMove() {
  const maskWrap = document.querySelector('#maskWrap')
  function maskMove(event) {
    const startX = maskInfo.x - event.pageX
    const startY = maskInfo.y - event.pageY
    let timer = null
    function move(e) {
      const changeX = startX + e.pageX
      const changeY = startY + e.pageY
      maskWrap.style.transform = `translate(${changeX}px, ${changeY}px)`
      maskInfo.x = changeX
      maskInfo.y = changeY
      if(timer) return // 节流一下，防止触发太频繁
      timer = setTimeout(() => {
        timer = null
      }, 30);
    }
  
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move)
    })
  }
  const maskList = ['LeftTop', 'RightTop', 'RrightBottom', 'LeftBottom']
  maskList.forEach(className => {
    const maskItemDom = document.createElement('div')
    maskItemDom.setAttribute('class', `mask mask${className}`)
    maskItemDom.addEventListener('mousedown', maskMove)
    maskWrap.appendChild(maskItemDom)
  })
}

function closeMaskMove() {
  const maskList = document.querySelectorAll(`.mask`)
  maskList.forEach(item => {
    item.remove()
  })
}

function openMask() {
  const maskWrap = document.createElement('div')
  maskWrap.setAttribute('id', 'maskWrap')
  // 给 maskWrap 添加变量
  maskWrap.style.setProperty('--size', 22)
  maskWrap.style.setProperty('--opacity', opacity / 100)
  // maskWrap.style.boxShadow = `50vmax 50vmax 0 50vmax rgba(0, 0, 0, ${opacity / 100})`

  document.body.appendChild(maskWrap)
}

function closeMask() {
  const maskWrap = document.querySelector('#maskWrap')
  document.body.removeChild(maskWrap)
}

openMask()
document.querySelector('#open').addEventListener('click', async () => {
  openMask()
})

document.querySelector('#close').addEventListener('click', async () => {
  closeMask()
})

const moveBtn = document.querySelector('#moveBtn')

moveBtn.addEventListener('click', async () => {
  if(!maskInfo.isMove) {
    moveBtn.setAttribute('class', 'btn')
    openMaskMove()
  } else {
    moveBtn.setAttribute('class', 'btn btnDisable')
    closeMaskMove()
  }
  maskInfo.isMove = !maskInfo.isMove
})