function openMask() {
  chrome.storage.sync.get('opacity', ({ opacity }) => {
    const maskDiv = document.createElement('div')
    maskDiv.setAttribute('id', 'mask')
    maskDiv.style.position = 'fixed'
    maskDiv.style.left = 0
    maskDiv.style.top = 0
    maskDiv.style.width = 0
    maskDiv.style.height = 0
    maskDiv.style.boxShadow = `0 0 0 100vmax rgba(0, 0, 0, ${opacity / 100})`
    maskDiv.style.zIndex = 99999
    document.body.appendChild(maskDiv)
  });
}

function closeMask() {
  const maskDiv = document.querySelector('#mask')
  document.body.removeChild(maskDiv)
}

function changeOpacity(opacity) {
  const maskDiv = document.querySelector('#mask')
  if(maskDiv) {
    maskDiv.style.boxShadow = `0 0 0 100vmax rgba(0, 0, 0, ${opacity / 100})`
  }
}

function changeValue(newOpacity) {
  let opacity = Math.min(Math.max(Math.round(newOpacity), 0), 100);
  progress.value = opacity
  progressValue.textContent = opacity
  chrome.storage.sync.set({ opacity })
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [opacity],
      func: changeOpacity,
    });
  })
}