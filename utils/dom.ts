function getPlasmoShadowRoot() {
  return document.querySelector("plasmo-csui")?.shadowRoot;
}

function getPlasmoAllShadowRoot() {
  return document.querySelectorAll("plasmo-csui");
}

export function getOnePlasmoShadowContainer() {
  return getPlasmoShadowRoot()?.querySelector(
    "#plasmo-shadow-container"
  ) as HTMLElement;
}

export function getTargetPlasmoShadowContainer(target) {
  return target?.querySelector(
    "#plasmo-shadow-container"
  ) as HTMLElement;
}

export function getPlasmoShadowContainer(id: string) {
  const arr = getPlasmoAllShadowRoot()
  let target: HTMLElement = null 
  for(let i = 0; i < arr.length; i++) {
  // for(let i = arr.length - 1; i >= 0; i--) {
    const htmlItem = getTargetPlasmoShadowContainer(arr[i].shadowRoot)
    if(htmlItem?.querySelector(`#${id}`)) {
      target = htmlItem
    }
  }
  return target
}

//see https://github.com/PlasmoHQ/plasmo/issues/652
export function injectCssText(cssText: string) {
  const plasmoCsui = getPlasmoShadowRoot();
  const style = document.createElement("style");
  style.textContent = cssText;
  plasmoCsui?.appendChild(style);
}
