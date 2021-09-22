const formatcurrency = (number) => {
  if (number) {
    if (typeof number == 'string') {
      number = number.replace(/\,/g, '') || 0;
      let new_number = parseFloat(number).toFixed(2) || 0;
      if (isNaN(new_number)) new_number = 0;
      return new_number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0;
    } else {
      number = parseFloat(number).toFixed(2) || 0;
      if (isNaN(number)) number = 0;
      return (number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) || 0;
    }
  } else {
    return '0.00';
  }
}
const elementId = (id) => { return document.getElementById(id); }
const elementName = (name) => { return document.getElementsByName(name); }

