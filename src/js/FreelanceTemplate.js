import '../scss/freelancetemplate.scss';
import InitModal from "./modal/InitModal";
import QuotationModal from "./modal/QuotationModal";

class FreelanceTemplate {


  constructor() {
    this._ls = window.localStorage;
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

    document.querySelector('#hello-freelancer').innerHTML = `Bonjour ${info.surname}!`;
    document.querySelector('#edit-freelancer').addEventListener('click', this._editFreelancer.bind(this));
    document.querySelector('#new-quotation').addEventListener('click', this._newQuotation.bind(this));
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
    const informationRetrieved = info => {
      this.get('assets/html/QuotationTemplate.html').then(template => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(template, 'text/html');
        const wrapper = dom.body.firstChild;
        document.querySelector('#section-content').appendChild(wrapper);

        const freelancerInfo = JSON.parse(this._ls.getItem('freelancer-info'));
        console.log(info, freelancerInfo)
        const date = new Date();
        wrapper.querySelector('#quotation-number').innerHTML = `${date.getFullYear()}-101`; // TODO, increment according to existing quotations
        wrapper.querySelector('#date-emission').innerHTML = `
          ${this.appendZeroPrefixToDate(date.getDate())}/${this.appendZeroPrefixToDate(date.getMonth() + 1)}/${date.getFullYear()}`;
        wrapper.querySelector('#date-ending').innerHTML = `
          ${this.appendZeroPrefixToDate(date.getDate())}/${this.appendZeroPrefixToDate(date.getMonth() + 2)}/${date.getFullYear()}`;
        wrapper.querySelector('#freelancer-name').innerHTML = `${freelancerInfo.genre} ${freelancerInfo.surname} ${freelancerInfo.name}`;
        wrapper.querySelector('#freelancer-address').innerHTML = `${freelancerInfo.address}<br>${freelancerInfo.zipcode} – ${freelancerInfo.town}`;
        wrapper.querySelector('#freelancer-phone').innerHTML = `${freelancerInfo.phone}`;
        wrapper.querySelector('#freelancer-mail').innerHTML = `${freelancerInfo.mail}`;
        wrapper.querySelector('#customer-company-name').innerHTML = `${info.society}`;
        wrapper.querySelector('#customer-company-type').innerHTML = `${info.type}`;
        wrapper.querySelector('#customer-address').innerHTML = `${info.address}<br>${info.zipcode} – ${info.town}`;
        wrapper.querySelector('#customer-siret').innerHTML = `${info.siret}`;
        wrapper.querySelector('#quotation-object').innerHTML = `${info.object}`;
        wrapper.querySelector('#freelancer-siret').innerHTML = `${freelancerInfo.siret}`;
        wrapper.querySelector('#freelancer-ape').innerHTML = `${freelancerInfo.ape}`;
        wrapper.querySelector('#freelancer-tva').innerHTML = `${freelancerInfo.tva}`;
        wrapper.querySelector('#freelancer-bank').innerHTML = `${freelancerInfo.bank}`;
        wrapper.querySelector('#freelancer-iban').innerHTML = `${freelancerInfo.iban}`;
        wrapper.querySelector('#freelancer-bic').innerHTML = `${freelancerInfo.bic}`;
      });
    };

    new QuotationModal({
      url: 'assets/html/QuotationModal.html',
      callback: informationRetrieved.bind(this)
    });

  }


  get(url) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: new Headers([ ['Content-Type', 'application/json; charset=UTF-8'] ])
      };

      fetch(url, options)
        .then(response => response.text())
        .then(resolve)
        .catch(reject);
    });
  }


  appendZeroPrefixToDate(value) {
    if (value.toString().length < 2) {
      value = `0${value}`;
    }

    return value;
  }


}


export default FreelanceTemplate;
