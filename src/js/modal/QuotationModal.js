import Modal from './Modal.js';


class QuotationModal extends Modal {



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
      society: this._rootElement.querySelector('#society').value,
      type: this._rootElement.querySelector('#type').value,
      address: this._rootElement.querySelector('#address').value,
      zipcode: this._rootElement.querySelector('#zipcode').value,
      town: this._rootElement.querySelector('#town').value,
      siret: this._rootElement.querySelector('#siret').value,
      object: this._rootElement.querySelector('#object').value
    });
    this.close();
  }


}


export default QuotationModal;
