function getPlasmoShadowRoot() {
  return document.querySelector("plasmo-csui")?.shadowRoot;
}

export function getOnePlasmoShadowContainer() {
  return getPlasmoShadowRoot()?.querySelector(
    "#plasmo-shadow-container"
  ) as HTMLElement;
}

export function getPlasmoShadowContainer(id: string) {
  const arr = getPlasmoShadowRoot()?.querySelectorAll(
    "#plasmo-shadow-container"
  );
  let target: HTMLElement = null 
  for(let i = 0; i < arr.length; i++) {
    if(arr[i].querySelector(`#${id}`)) {
      target = arr[i] as HTMLElement
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
