/** 初始的透明度 */
const INIT_OPACITY = 40;
const INIT_MASKINFO = {x: 0, y: 0, size: 100, isMove: false}
const getInitMaskInfo = () => structuredClone(INIT_MASKINFO)

const progress = document.querySelector('#progress')
const progressValue = document.querySelector('#progressValue')
const openBtn = document.querySelector('#openBtn')
const moveBtn = document.querySelector('#moveBtn')

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

chrome.storage.sync.get('isOpen', ({ isOpen }) => {
  openBtn.textContent = !isOpen ? '打开' : '关闭'
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
    changeValue(opacity - 10)
  });
})

document.querySelector('.add').addEventListener('click', () => {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    changeValue(opacity + 10)
  });
})

progress.addEventListener('mousedown', (event) => {
  changeValue(event.offsetX * 100 / progress.clientWidth)
  const startX = event.pageX
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

openBtn.addEventListener('click', async () => {
  const isOpen = await getStorageSync('isOpen')
  if(!isOpen) { // 打开mask
    const tabId = await getTabId();
    // 获取当前激活的tab的id，注入执行 func
    chrome.scripting.executeScript({target: { tabId }, func: openMask});
    chrome.scripting.insertCSS({
      target: { tabId },
      // 这里的路径要按项目根目录开始
      files: ['src/mask.css'] 
    });
    getStorageSync('maskInfo').then(maskInfo => {
      if(maskInfo.isMove) {
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId },
            args: [maskInfo],
            func: openMaskMove,
          });
        }, 10);
      }
    })
  } else { // 关闭mask
    getTabId().then((tabId) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: closeMask,
      });
    })
  }
  openBtn.textContent = isOpen ? '打开' : '关闭'
  chrome.storage.sync.set({isOpen: !isOpen})
})

moveBtn.addEventListener('click', async () => {
  const isOpen = await getStorageSync('isOpen')
  if(!isOpen) return
  chrome.storage.sync.get('maskInfo', ({ maskInfo }) => {
    if(!maskInfo.isMove) {
      moveBtn.setAttribute('class', 'btn btnDisable')
      getTabId().then((tabId) => {
        chrome.scripting.executeScript({
          target: { tabId },
          args: [maskInfo],
          func: openMaskMove,
        });
      })
    } else {
      moveBtn.setAttribute('class', 'btn')
      getTabId().then((tabId) => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: closeMaskMove,
        });
      })
    }
    maskInfo.isMove = !maskInfo.isMove
    chrome.storage.sync.set({ maskInfo })
  });
})
