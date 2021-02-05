import Modal from './Modal.js';


class InitModal extends Modal {



  constructor(options) {
    super(options);

    this._cb = options.callback;
    this._saveButton = null;
    this.save = this.save.bind(this);
  }


  destroy() {
    super.destroy();
    this._saveButton.removeEventListener('click', this.save);
  }


  _fillAttributes() {
    this._saveButton = this._rootElement.querySelector('#modal-footer-save');
    this._events();
  }


  _events() {
    this._saveButton.addEventListener('click', this.save);
  }


  save() {
    this._cb({
      genre: this._rootElement.querySelector('#civility').value,
      surname: this._rootElement.querySelector('#surname').value,
      name: this._rootElement.querySelector('#name').value,
      address: this._rootElement.querySelector('#address').value,
      zipcode: this._rootElement.querySelector('#zipcode').value,
      town: this._rootElement.querySelector('#town').value,
      phone: this._rootElement.querySelector('#phone').value,
      mail: this._rootElement.querySelector('#mail').value,
      siret: this._rootElement.querySelector('#siret').value,
      ape: this._rootElement.querySelector('#ape').value,
      tva: this._rootElement.querySelector('#tva').value,
      bank: this._rootElement.querySelector('#bank').value,
      iban: this._rootElement.querySelector('#iban').value,
      bic: this._rootElement.querySelector('#bic').value
    });
    this.close();
  }


}


export default InitModal;
