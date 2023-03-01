
export default class Controller {
    #view;
    #worker;
    #camera;
    #service;
    #blinkCounter;
    constructor({ view, worker, camera }) {
      this.#view = view
      this.#camera = camera
      this.#worker = this.#configureWorker(worker);
      this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
    }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log('not yet detecting, click to start')
    return controller.init();
  }

  #configureWorker(worker){
    let ready=false;
    worker.onmessage = ({data}) => {
      console.log(data);
      if(data === 'READY'){
        this.#view.enableButton();
        ready  = true;
        return;
      }
      const blinked = data.blinked;
      this.#blinkCounter += blinked;
      this.#view.togglePlayVideo();
      console.log('blinked', blinked);
    }
    
    return {
      send (msg) {
        if(!ready) return;
        worker.postMessage(msg)
      }
    }
  }
  loop() {
    const video = this.#camera.video;
    const img = this.#view.getVideoFrame(video);
    this.#worker.send(img);
    this.log('detecting eye blink')
    setTimeout(() => this.loop(), 100)

  }

  async init() {
    console.log('init!!!');
  }

  log(text) {
    const times = `        = blinked times  ${this.#blinkCounter}`
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""));
  }

  onBtnStart() {
    this.#blinkCounter = 0;
    this.log('started detection')
    this.loop();
  }

}
