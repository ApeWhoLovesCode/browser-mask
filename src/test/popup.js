let opacity = 40;
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
  const maskDiv = document.querySelector('#mask')
  if(maskDiv) {
    maskDiv.style.boxShadow = `0 0 0 100vmax rgba(0, 0, 0, ${opacity / 100})`
  }
}

function openMask() {
  const maskDiv = document.createElement('div')
  maskDiv.setAttribute('id', 'mask')
  maskDiv.style.position = 'fixed'
  maskDiv.style.boxShadow = `0 0 0 100vmax rgba(0, 0, 0, ${opacity / 100})`
  document.body.appendChild(maskDiv)
}

function closeMask() {
  const maskDiv = document.querySelector('#mask')
  document.body.removeChild(maskDiv)
}

document.querySelector('#open').addEventListener('click', async () => {
  openMask()
})

document.querySelector('#close').addEventListener('click', async () => {
  closeMask()
})