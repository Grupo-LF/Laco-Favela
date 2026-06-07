import React, { useState } from 'react';
import { maskPhone, maskCEP, maskCPF, maskMoney } from '../../utils/masks';

// >>> INÍCIO DO CÓDIGO NOVO (substitui o arquivo inteiro) <<<

const FormField = ({
  type = 'text',
  label,
  name,
  placeholder,
  rules = {},
  options = [],
  value,
  onChange,
  onValidationChange,
  mask
}) => {
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState([]);

  const validate = (val) => {
    const errs = [];
    if (rules.required && !val.trim()) {
      errs.push('Campo obrigatório');
    }
    if (rules.minLength && val.length < rules.minLength) {
      errs.push(`Mínimo de ${rules.minLength} caracteres`);
    }
    if (rules.maxLength && val.length > rules.maxLength) {
      errs.push(`Máximo de ${rules.maxLength} caracteres`);
    }
    if (rules.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errs.push('E-mail inválido');
    }
    if (rules.number && val && isNaN(Number(val))) {
      errs.push('Deve ser um número');
    }
    return errs;
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (mask === 'phone') val = maskPhone(val);
    else if (mask === 'cep') val = maskCEP(val);
    else if (mask === 'cpf') val = maskCPF(val);
    else if (mask === 'money') val = maskMoney(val);

    const errs = validate(val);
    setErrors(errs);
    if (onValidationChange) onValidationChange(errs.length === 0);
    if (onChange) onChange({ name, value: val, isValid: errs.length === 0, errors: errs });
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`form-field__input form-field__textarea ${touched && errors.length ? 'form-field__input--error' : ''} ${touched && !errors.length ? 'form-field__input--success' : ''}`}
          />
        );
      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-field__input ${touched && errors.length ? 'form-field__input--error' : ''} ${touched && !errors.length ? 'form-field__input--success' : ''}`}
          >
            <option value="">Selecione...</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="form-field__checkbox-group">
            {options.map((opt, idx) => (
              <label key={idx} className="form-field__checkbox-label">
                <input
                  type="checkbox"
                  name={name}
                  value={opt.value}
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={(e) => {
                    const newVal = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newVal.push(opt.value);
                    } else {
                      const index = newVal.indexOf(opt.value);
                      if (index > -1) newVal.splice(index, 1);
                    }
                    handleChange({ target: { value: newVal } });
                  }}
                  onBlur={handleBlur}
                />
                <span className="form-field__checkbox-label-text">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="form-field__radio-group">
            {options.map((opt, idx) => (
              <label key={idx} className="form-field__radio-label">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="form-field__radio-label-text">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`form-field__input ${touched && errors.length ? 'form-field__input--error' : ''} ${touched && !errors.length ? 'form-field__input--success' : ''}`}
          />
        );
    }
  };

  return (
    <div className="form-field">
      {label && <label className="form-field__label" htmlFor={name}>{label}{rules.required ? ' *' : ''}</label>}
      {renderField()}
      {touched && errors.length > 0 && (
        <div className="form-field__errors">
          {errors.map((err, idx) => (
            <span key={idx} className="form-field__error-text">{err}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormField;

// >>> FIM DO CÓDIGO NOVO <<<