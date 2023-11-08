async function getTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id
}

function getStorageSync(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (item) => {
      resolve(item[key])
    })
  })
}

/** 注入打开 mask 的代码 */
async function executeOpenMask(tabId) {
  const maskInfo = await getStorageSync('maskInfo')
  // 获取当前激活的tab的id，注入执行 func
  chrome.scripting.executeScript({
    target: { tabId }, 
    args: [maskInfo], 
    func: openMask
  });
  chrome.scripting.insertCSS({
    target: { tabId },
    // 这里的路径要按项目根目录开始
    files: ['src/mask.css'] 
  });
  if(maskInfo.isMove) {
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId },
        args: [maskInfo],
        func: openMaskMove,
      });
    }, 10);
  }
}

function openMask(maskInfo) {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    const maskWrap = document.createElement('div')
    maskWrap.setAttribute('id', 'maskWrap')
    maskWrap.style.transform = `translate(${maskInfo.x}px, ${maskInfo.y}px)`
    // 给 maskWrap 添加变量
    maskWrap.style.setProperty('--size', 22)
    maskWrap.style.setProperty('--opacity', opacity / 100)
    document.body.appendChild(maskWrap)
  });
}

function injectCloseMask() {
  const maskWrap = document.querySelector('#maskWrap')
  if(maskWrap) {
    document.body.removeChild(maskWrap)
  }
}

function injectChangeOpacity(opacity) {
  const maskWrap = document.querySelector('#maskWrap')
  if(maskWrap) {
    maskWrap.style.setProperty('--opacity', opacity / 100)
  }
}

function changeOpacity(newOpacity) {
  let opacity = Math.min(Math.max(Math.round(newOpacity), 0), 100);
  progress.value = opacity
  progressValue.textContent = opacity
  chrome.storage.sync.set({ opacity })
  getTabId().then((tabId) => {
    chrome.scripting.executeScript({
      target: { tabId },
      args: [opacity],
      func: injectChangeOpacity,
    });
  })
}

function injectChangeMask(maskInfo) {
  const maskWrap = document.querySelector('#maskWrap')
  if(maskWrap) {
    maskWrap.style.transform = `translate(${maskInfo.x}px, ${maskInfo.y}px)`
  }
}

/** 打开mask的移动操作 */
function openMaskMove(maskInfo) {
  const maskWrap = document.querySelector('#maskWrap')
  function maskMove(event) {
    const startX = maskInfo.x - event.pageX
    const startY = maskInfo.y - event.pageY
    function move(e) {
      const changeX = startX + e.pageX
      const changeY = startY + e.pageY
      maskWrap.style.transform = `translate(${changeX}px, ${changeY}px)`
      maskInfo.x = changeX
      maskInfo.y = changeY
    }
  
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', () => {
      chrome.storage.sync.set({ maskInfo })
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

/** 关闭mask的移动操作 */
function closeMaskMove() {
  const maskList = document.querySelectorAll(`.mask`)
  maskList.forEach(item => {
    item.remove()
  })
}