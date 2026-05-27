export function maskPhone(value) {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }
  if (value.length > 9) {
    value = value.slice(0, 9) + '-' + value.slice(9);
  }
  return value;
}

export function maskCEP(value) {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5);
  }
  return value;
}

export function maskCPF(value) {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 9) {
    value = value.slice(0, 9) + '-' + value.slice(9);
  }
  if (value.length > 6) {
    value = value.slice(0, 6) + '.' + value.slice(6);
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + '.' + value.slice(3);
  }
  return value;
}

export function maskCNPJ(value) {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  if (value.length > 14) value = value.slice(0, 14);
  if (value.length > 12) {
    value = value.slice(0, 12) + '-' + value.slice(12);
  }
  if (value.length > 9) {
    value = value.slice(0, 9) + '/' + value.slice(9);
  }
  if (value.length > 6) {
    value = value.slice(0, 6) + '.' + value.slice(6);
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + '.' + value.slice(3);
  }
  return value;
}

export function maskMoney(value) {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = (parseInt(value, 10) / 100).toFixed(2);
  value = value.replace('.', ',');
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return 'R$ ' + value;
}

export const mascaraTelefone = maskPhone;
export const mascaraCNPJ = maskCNPJ;