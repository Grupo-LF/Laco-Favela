export const mascaraTelefone = (valor) => {
  if (!valor) return '';
  let v = valor.replace(/\D/g, '');
  
  if (v.length <= 10){
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  } else{
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
  }

  return v.substring(0, 15);
};

export const mascaraCNPJ = (valor) => {
  if (!valor) return '';
  return valor
    .replace(/\D/g, '') 
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};