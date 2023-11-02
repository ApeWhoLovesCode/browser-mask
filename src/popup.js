/** 初始的透明度 */
const INIT_OPACITY = 40;

const progress = document.querySelector('#progress')
const progressValue = document.querySelector('#progressValue')

chrome.storage.sync.get('opacity', ({ opacity: opa }) => {
  if(!opa) {
    chrome.storage.sync.set({ opacity: INIT_OPACITY })
  } else {
    progress.value = opa
    progressValue.textContent = opa
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

document.querySelector('#open').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // 获取当前激活的tab的id，注入执行 func
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: openMask,
  });
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    // 这里的路径要按项目根目录开始
    files: ['src/mask.css'] 
  });
})

document.querySelector('#close').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: closeMask,
  });
})
