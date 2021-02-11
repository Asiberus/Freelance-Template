import NewContactModal from "../modal/NewContractModal";


const newContract = freelancerInfo => {
  new NewContactModal({
    url: 'assets/html/NewContractModal.html',
    callback: modalInfoRetrieved.bind(this, freelancerInfo)
  });
};


const modalInfoRetrieved = (freelancerInfo, contractInfo) => {
  console.log(freelancerInfo, contractInfo)
};


export { newContract };