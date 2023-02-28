export default class View {
  #btnInit = document.querySelector('#init');
  #outputElement = document.querySelector('#status');

  enableButton() {
    this.#btnInit.disabled = false;
  }

  configureOnBtnClick(fn){
    this.#btnInit.addEventListener('click', fn);
  }

  log(text) {
    this.#outputElement.innerHTML = text
  }
}
