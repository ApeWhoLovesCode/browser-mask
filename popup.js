/** 初始的透明度 */
const INIT_OPACITY = 40;

const progress = document.querySelector('#progress')
const reduceBtn = document.querySelector('.reduce')
const addBtn = document.querySelector('.add')
const tips = document.querySelector('.tips')

chrome.storage.sync.get('opacity', ({ opacity: opa }) => {
  if(!opa) {
    chrome.storage.sync.set({ opacity: INIT_OPACITY })
  } else {
    progress.value = opa
    tips.textContent = opa
  }
});

function changeOpacity(opacity) {
  const maskDiv = document.querySelector('#mask')
  if(maskDiv) {
    maskDiv.style.background = `rgba(0,0,0,${(opacity ?? INIT_OPACITY) / 100})`
  }
  chrome.storage.sync.set({ opacity })
}

function changeValue(newOpacity) {
  let opacity = Math.min(Math.max(Math.round(newOpacity), 0), 100);
  progress.value = opacity
  tips.textContent = opacity
  chrome.storage.sync.set({ opacity })
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [opacity],
      func: changeOpacity,
    });
  })
}
reduceBtn.addEventListener('click', () => {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    changeValue(opacity - 10)
  });
})
addBtn.addEventListener('click', () => {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    changeValue(opacity + 10)
  });
})
progress.addEventListener('mousedown', (event) => {
  const startX = event.pageX

  // 待开发：刚开始点击的时候直接触发进度条

  let startOpacity = INIT_OPACITY
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    startOpacity = opacity
  });

  let timer = null
  function move(e) {
    const changeX = e.pageX - startX
    if(timer) return // 节流一下，防止触发太频繁
    changeValue(startOpacity + changeX * 100 / progress.clientWidth)
    timer = setTimeout(() => {
      timer = null
    }, 60);
  }

  document.addEventListener('mousemove', move)

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move)
  })
})

function openMask() {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    const maskDiv = document.createElement('div')
    maskDiv.setAttribute('id', 'mask')
    maskDiv.style.position = 'fixed'
    maskDiv.style.left = 0
    maskDiv.style.right = 0
    maskDiv.style.top = 0
    maskDiv.style.bottom = 0
    maskDiv.style.width = '100vw'
    maskDiv.style.height = '100vh'
    maskDiv.style.background = `rgba(0,0,0,${opacity / 100})`
    maskDiv.style.zIndex = 99999
    maskDiv.style.transition = `background 0.4s ease`
    maskDiv.addEventListener('click', () => {
      document.body.removeChild(maskDiv)
    })
    document.body.appendChild(maskDiv)
  });
}

function closeMask() {
  const maskDiv = document.querySelector('#mask')
  document.body.removeChild(maskDiv)
}

document.querySelector('#open').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // 监听点击事件，并获取当前激活的tab的id，执行 func
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: openMask,
  });
})

document.querySelector('#close').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: closeMask,
  });
})
