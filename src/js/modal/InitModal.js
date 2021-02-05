import Modal from './Modal.js';


class InitModal extends Modal {



  constructor(options) {
    super(options);

    this._cb = options.callback;
    this._data = options.data;
    this._saveButton = null;
    this.save = this.save.bind(this);
  }


  destroy() {
    super.destroy();
    this._saveButton.removeEventListener('click', this.save);
  }


  _fillAttributes() {
    this._saveButton = this._rootElement.querySelector('#modal-footer-save');
    if (this._data) {
      this._rootElement.querySelector('#civility').value = this._data.genre;
      this._rootElement.querySelector('#surname').value = this._data.surname;
      this._rootElement.querySelector('#name').value = this._data.name;
      this._rootElement.querySelector('#address').value = this._data.address;
      this._rootElement.querySelector('#zipcode').value = this._data.zipcode;
      this._rootElement.querySelector('#town').value = this._data.town;
      this._rootElement.querySelector('#phone').value = this._data.phone;
      this._rootElement.querySelector('#mail').value = this._data.mail;
      this._rootElement.querySelector('#siret').value = this._data.siret;
      this._rootElement.querySelector('#ape').value = this._data.ape;
      this._rootElement.querySelector('#tva').value = this._data.tva;
      this._rootElement.querySelector('#bank').value = this._data.bank;
      this._rootElement.querySelector('#iban').value = this._data.iban;
      this._rootElement.querySelector('#bic').value = this._data.bic;
    }
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
