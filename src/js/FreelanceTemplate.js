import '../scss/freelancetemplate.scss';
import Notification from "./tools/Notification";
import InitModal from "./modal/InitModal";
import { newQuotation, listQuotation } from './pages/Quotation';
import { newContract } from './pages/Contract';


class FreelanceTemplate {


  constructor() {
    this._ls = window.localStorage;
    this.Notification = new Notification();
  }


  init() {
    if (!this._ls.getItem('freelancer-info')) {
      new InitModal({
        url: 'assets/html/InitModal.html',
        callback: this._init.bind(this)
      });
    } else {
      this._init();
    }
  }


  _init(info) {
    if (!info) {
      info = JSON.parse(this._ls.getItem('freelancer-info'));
    } else {
      this._ls.setItem('freelancer-info', JSON.stringify(info));
    }

    const quotation = JSON.parse(this._ls.getItem('quotations'));
    if (quotation) {
      document.querySelector('#quotation-count').innerHTML = quotation.saved.length;
    }

    document.querySelector('#hello-freelancer').innerHTML = `Bonjour ${info.surname}!`;
    document.querySelector('#edit-freelancer').addEventListener('click', this._editFreelancer.bind(this));

    document.querySelector('#new-quotation').addEventListener('click', this._newQuotation.bind(this));
    document.querySelector('#quotation-count').addEventListener('click', this._listQuotation.bind(this));

    document.querySelector('#new-contract').addEventListener('click', this._newContract.bind(this));

  }


  _editFreelancer() {
    new InitModal({
      url: 'assets/html/InitModal.html',
      data: JSON.parse(this._ls.getItem('freelancer-info')),
      callback: info => {
        this._ls.setItem('freelancer-info', JSON.stringify(info));
      }
    });
  }


  _newQuotation() {
    newQuotation(JSON.parse(this._ls.getItem('freelancer-info')));
  }


  _listQuotation() {
    const quotations = JSON.parse(this._ls.getItem('quotations'));
    if (quotations) {
      listQuotation(quotations);
    }
  }


  _newContract() {
    newContract(JSON.parse(this._ls.getItem('freelancer-info')));
  }


  clearView() {
    document.querySelector('#view-controls').innerHTML = '';
    document.querySelector('#section-content').innerHTML = '';
  }


  get ls() {
    return this._ls;
  }


}


export default FreelanceTemplate;
