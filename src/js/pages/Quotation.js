import { get, appendZeroPrefixToDate } from '../tools/Utils';
import QuotationModal from "../modal/QuotationModal";
import { jsPDF } from '../../../assets/lib/jspdf.umd.min';


/* New quotation methods */


const newQuotation = freelancerInfo => {
  new QuotationModal({
    url: 'assets/html/QuotationModal.html',
    callback: modalInfoRetrieved.bind(this, freelancerInfo)
  });
};


const modalInfoRetrieved = (freelancerInfo, customerInfo) => {
    const date = new Date();
    let quotationNumber = `${date.getFullYear()}-101`;
    const quotation = JSON.parse(window.FT.ls.getItem('quotations'));
    if (quotation) {
      quotationNumber = `${quotation.lastNumber.split('-')[0]}-${parseInt(quotation.lastNumber.split('-')[1]) + 1}`;
    }
    const quotationInfo = {
      number: quotationNumber, // TODO, increment according to existing quotations
      emission: `${appendZeroPrefixToDate(date.getDate())}/${appendZeroPrefixToDate(date.getMonth() + 1)}/${date.getFullYear()}`,
      ending: `${appendZeroPrefixToDate(date.getDate())}/${appendZeroPrefixToDate(date.getMonth() + 2)}/${date.getFullYear()}`,
      htPrice: '0 €',
      globalDiscount: '0 %',
      totalPrice: '0 €'
    };

    window.FT.clearView();
    buildQuotation(freelancerInfo, customerInfo, quotationInfo);
};


const buildQuotation = (freelancerInfo, customerInfo, quotationInfo) => {
  get('assets/html/QuotationTemplate.html').then(template => {
    // Parse template and append it to the section container
    const parser = new DOMParser();
    const dom = parser.parseFromString(template, 'text/html');
    const wrapper = dom.body.firstChild;
    document.querySelector('#section-content').appendChild(wrapper);
    // Template filling with custom info
    wrapper.querySelector('#quotation-number').innerHTML = quotationInfo.number;
    wrapper.querySelector('#date-emission').innerHTML = quotationInfo.emission;
    wrapper.querySelector('#date-ending').innerHTML = quotationInfo.ending;
    wrapper.querySelector('#freelancer-name').innerHTML = `${freelancerInfo.genre} ${freelancerInfo.surname} ${freelancerInfo.name}`;
    wrapper.querySelector('#freelancer-address').innerHTML = `${freelancerInfo.address}<br>${freelancerInfo.zipcode} – ${freelancerInfo.town}`;
    wrapper.querySelector('#freelancer-phone').innerHTML = `${freelancerInfo.phone}`;
    wrapper.querySelector('#freelancer-mail').innerHTML = `${freelancerInfo.mail}`;
    wrapper.querySelector('#customer-company-name').innerHTML = `${customerInfo.society}`;
    wrapper.querySelector('#customer-company-type').innerHTML = `${customerInfo.type}`;
    wrapper.querySelector('#customer-address').innerHTML = `${customerInfo.address}<br>${customerInfo.zipcode} – ${customerInfo.town}`;
    wrapper.querySelector('#customer-siret').innerHTML = `${customerInfo.siret}`;
    wrapper.querySelector('#quotation-object').innerHTML = `${customerInfo.object}`;
    wrapper.querySelector('#freelancer-siret').innerHTML = `${freelancerInfo.siret}`;
    wrapper.querySelector('#freelancer-ape').innerHTML = `${freelancerInfo.ape}`;
    wrapper.querySelector('#freelancer-tva').innerHTML = `${freelancerInfo.tva}`;
    wrapper.querySelector('#freelancer-bank').innerHTML = `${freelancerInfo.bank}`;
    wrapper.querySelector('#freelancer-iban').innerHTML = `${freelancerInfo.iban}`;
    wrapper.querySelector('#freelancer-bic').innerHTML = `${freelancerInfo.bic}`;
    // Quotation interactivity
    const dlImg = document.createElement('IMG');
    dlImg.src = 'assets/img/download.svg';
    document.querySelector('#view-controls').appendChild(dlImg);
    dlImg.addEventListener('click', downloadQuotation.bind(dlImg, wrapper.children[0], quotationInfo.number));

    const saveImg = document.createElement('IMG');
    saveImg.src = 'assets/img/save.svg';
    document.querySelector('#view-controls').appendChild(saveImg);
    saveImg.addEventListener('click', saveQuotation.bind(saveImg, freelancerInfo, customerInfo, quotationInfo));
  });
};


const downloadQuotation = (wrapper, number) => {
  // Hacking modal overlay to display a loading screen
  const overlay = document.createElement('DIV');
  overlay.className = 'loading-overlay';
  document.body.appendChild(overlay);
  // Remove border shadow for document for proper printing
  wrapper.classList.add('printing');
  html2canvas(wrapper, {
    scale: 5
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    console.log(imgData)
    const file = new jsPDF('p', 'mm', 'a4', true);
    file.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    file.save(`Devis - ${number}.pdf`);
    wrapper.classList.remove('printing');
    document.body.removeChild(overlay);
  });
};


const saveQuotation = (freelancerInfo, customerInfo, quotationInfo) => {
  let quotation = JSON.parse(window.FT.ls.getItem('quotations'));
  if (!quotation) {
    quotation = {
      lastNumber: quotationInfo.number,
      saved: []
    };
  }
  // Try to find already saved quotation
  for (let i = 0; i < quotation.saved.length; ++i) {
    // Found the saved quotation, update it then return
    if (quotation.saved[i].quotationInfo.number === quotationInfo.number) {
      quotation.saved[i] = {
        freelancerInfo: freelancerInfo,
        customerInfo: customerInfo,
        quotationInfo: quotationInfo
      };
      window.FT.ls.setItem('quotations', JSON.stringify(quotation));
      window.FT.Notification.success({
        title: 'Devis mis a jour',
        message: `Le devis ${quotationInfo.number} à été mis à jour. Vous pourrez le retrouver dans la liste de vos devis.`
      });
      return;
    }
  }
  // No saved quotation found, update last number, save current one
  quotation.lastNumber = quotationInfo.number;
  quotation.saved.push({
    freelancerInfo: freelancerInfo,
    customerInfo: customerInfo,
    quotationInfo: quotationInfo
  });
  document.querySelector('#quotation-count').innerHTML = quotation.saved.length;
  window.FT.ls.setItem('quotations', JSON.stringify(quotation));
  window.FT.Notification.success({
    title: 'Devis sauvegardé',
    message: `Le devis ${quotationInfo.number} à été sauvegardé. Vous pourrez le retrouver dans la liste de vos devis.`
  });
};


/* Listing quotation front page */


const listQuotation = quotations => {
  window.FT.clearView();
  const container = document.createElement('DIV');
  container.classList.add('quotations-list');
  for (let i = 0; i < quotations.saved.length; ++i) {
    const quotation = document.createElement('DIV');
    const number = document.createElement('H5');
    const date = document.createElement('P');
    const customer = document.createElement('P');
    const object = document.createElement('P');
    const price = document.createElement('P');
    quotation.classList.add('quotation-preview');

    number.innerHTML = `Devis ${quotations.saved[i].quotationInfo.number}`;
    date.innerHTML = `<i>${quotations.saved[i].quotationInfo.emission}</i>`;
    customer.innerHTML = `${quotations.saved[i].customerInfo.society}`;
    object.innerHTML = `${quotations.saved[i].customerInfo.object}`;
    price.innerHTML = `<b>${quotations.saved[i].quotationInfo.totalPrice}</b>`;

    const group1 = document.createElement('DIV');
    const group2 = document.createElement('DIV');
    const group3 = document.createElement('DIV');

    group1.appendChild(number);
    group1.appendChild(date);
    group1.appendChild(customer);
    group2.appendChild(object);
    group3.appendChild(price);
    quotation.appendChild(group1);
    quotation.appendChild(group2);
    quotation.appendChild(group3);
    container.appendChild(quotation);

    quotation.addEventListener('click', () => {
      window.FT.clearView();
      buildQuotation(quotations.saved[i].freelancerInfo, quotations.saved[i].customerInfo, quotations.saved[i].quotationInfo);
    });
  }
  document.querySelector('#section-content').appendChild(container);
};


export { newQuotation, listQuotation };
