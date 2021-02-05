class Modal {


  constructor(options) {
    this._url = options.url;
    this._rootElement = null;
    this._modalOverlay = null;
    this._closeButton = null;
    this.close = this.close.bind(this);
    this._loadTemplate();
  }


  destroy() {
    this._modalOverlay.removeEventListener('click', this.close);
    this._closeButton.removeEventListener('click', this.close);
    // Must be overridden in child class to clean extension properties and events
    delete this._url;
    delete this._rootElement;
    delete this._modalOverlay;
    delete this._closeButton;
  }



  _loadTemplate() {
    window.FreelanceTemplate.get(this._url).then(template => {
      this._rootElement = this._parseHTMLFragment(template);
      // Create overlay modal container
      this._modalOverlay = document.createElement('DIV');
      this._modalOverlay.className = 'loading-overlay';
      this._modalOverlay.appendChild(this._rootElement);
      // Get close button from template
      this._closeButton = this._rootElement.querySelector('#modal-close');
      this.open();
      this._fillAttributes();
    });
  }



  _fillAttributes() {
    // Must be overridden in child class to build modal with HTML template attributes
  }


  _parseHTMLFragment(htmlString) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    return dom.body.firstChild;
  }



  open() {
    document.body.appendChild(this._modalOverlay);
    this._modalOverlay.addEventListener('click', this.close);
    this._closeButton.addEventListener('click', this.close);
  }


  close(event) {
    // Must be overridden in child class to properly clean extension properties and events
    if (!event || (event && (event.target === this._modalOverlay || event.target === this._closeButton || event.target === this._footerCloseButton))) {
      // Remove the overlay from the body
      document.body.removeChild(this._modalOverlay);
      // Use the child class destroy
      this.destroy();
    }
  }


}


export default Modal;
