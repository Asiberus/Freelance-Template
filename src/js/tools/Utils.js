const get = url => {
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
};


const appendZeroPrefixToDate = value => {
  if (value.toString().length < 2) {
    value = `0${value}`;
  }

  return value;
}


export { get, appendZeroPrefixToDate };
