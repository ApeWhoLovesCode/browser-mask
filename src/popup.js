/** 初始的透明度 */
const INIT_OPACITY = 40;
const INIT_MASKINFO = {x: 0, y: 0, size: 100, isMove: false}
const getInitMaskInfo = () => structuredClone(INIT_MASKINFO)

const progress = document.querySelector('#progress')
const progressValue = document.querySelector('#progressValue')
const openBtn = document.querySelector('#openBtn')
const moveBtn = document.querySelector('#moveBtn')

chrome.storage.sync.get('isOpen', ({ isOpen }) => {
  openBtn.textContent = !isOpen ? '打开' : '关闭'
  // if(isOpen) {
  //   getTabId().then(tabId => {
  //     executeOpenMask(tabId)
  //   })
  // }
});

chrome.storage.sync.get('opacity', ({ opacity }) => {
  if(!opacity) {
    chrome.storage.sync.set({ opacity: INIT_OPACITY })
  } else {
    progress.value = opacity
    progressValue.textContent = opacity
  }
});

chrome.storage.sync.get('maskInfo', ({ maskInfo }) => {
  moveBtn.setAttribute('class', `btn${maskInfo?.isMove ? ' btnDisable' : ''}`)
  if(!maskInfo) {
    chrome.storage.sync.set({ maskInfo: getInitMaskInfo()})
  }
});

document.querySelector('.reduce').addEventListener('click', () => {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    changeOpacity(opacity - 10)
  });
})

document.querySelector('.add').addEventListener('click', () => {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    changeOpacity(opacity + 10)
  });
})

progress.addEventListener('mousedown', (event) => {
  changeOpacity(event.offsetX * 100 / progress.clientWidth)
  const startX = event.pageX
  let startOpacity = INIT_OPACITY
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    startOpacity = opacity
  });

  let timer = null
  function move(e) {
    const changeX = e.pageX - startX
    if(timer) return // 节流一下，防止触发太频繁
    changeOpacity(startOpacity + changeX * 100 / progress.clientWidth)
    timer = setTimeout(() => {
      timer = null
    }, 60);
  }

  document.addEventListener('mousemove', move)

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move)
  })
})

openBtn.addEventListener('click', async () => {
  const tabId = await getTabId();
  const isOpen = await getStorageSync('isOpen')
  if(!isOpen) { // 打开mask
    executeOpenMask(tabId)
  } else { // 关闭mask
    chrome.scripting.executeScript({
      target: { tabId },
      func: injectCloseMask,
    });
  }
  openBtn.textContent = isOpen ? '打开' : '关闭'
  chrome.storage.sync.set({isOpen: !isOpen})
})

moveBtn.addEventListener('click', async () => {
  const maskInfo = await getStorageSync('maskInfo')
  const tabId = await getTabId()
  if(!maskInfo.isMove) {
    moveBtn.setAttribute('class', 'btn btnDisable')
    chrome.scripting.executeScript({
      target: { tabId },
      args: [maskInfo],
      func: openMaskMove,
    });
  } else {
    moveBtn.setAttribute('class', 'btn')
    chrome.scripting.executeScript({
      target: { tabId },
      func: closeMaskMove,
    });
  }
  maskInfo.isMove = !maskInfo.isMove
  chrome.storage.sync.set({ maskInfo })
})

// 点击重置
document.querySelector('#reset').addEventListener('click', () => {
  changeOpacity(INIT_OPACITY)
  const maskInfo = getInitMaskInfo()
  chrome.storage.sync.set({maskInfo})
  moveBtn.setAttribute('class', 'btn')
  getTabId().then((tabId) => {
    chrome.scripting.executeScript({
      target: { tabId },
      args: [maskInfo],
      func: injectChangeMask,
    });
    chrome.scripting.executeScript({
      target: { tabId },
      func: closeMaskMove,
    });
  })
})

// 在这里执行您需要在 popup 关闭时进行的操作 （没用）
// window.addEventListener('unload', function() {
  // chrome.storage.sync.set({isOpen: false})
  // getTabId().then(tabId => {
  //   chrome.scripting.executeScript({
  //     target: { tabId },
  //     func: injectCloseMask,
  //   });
  // });
// });