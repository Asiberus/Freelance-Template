import Modal from './Modal.js';


class NewContactModal extends Modal {



  constructor(options) {
    super(options);

    this._cb = options.callback;
    this._generateButton = null;
    this.generate = this.generate.bind(this);
  }


  destroy() {
    super.destroy();
    this._generateButton.removeEventListener('click', this.generate);
  }


  _fillAttributes() {
    this._generateButton = this._rootElement.querySelector('#modal-footer-generate');
    this._events();
  }


  _events() {
    this._generateButton.addEventListener('click', this.generate);
  }


  generate() {
    this._cb({
      type: this._rootElement.querySelector('#type').value
    });
    this.close();
  }


}


export default NewContactModal;
