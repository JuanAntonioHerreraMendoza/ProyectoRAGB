export const validarContraseña = (value) => {
  const isNonWhiteSpace = /^\S*$/;
  if (!isNonWhiteSpace.test(value)) {
    return "La contraseña no puede tener espacios.";
  }

  const isContainsUppercase = /^(?=.*[A-Z]).*$/;
  if (!isContainsUppercase.test(value)) {
    return "La contraseña debe tener al menos una letra mayuscula";
  }

  const isContainsLowercase = /^(?=.*[a-z]).*$/;
  if (!isContainsLowercase.test(value)) {
    return "La contraseña debe tener al menos una letra minuscula";
  }

  const isContainsNumber = /^(?=.*[0-9]).*$/;
  if (!isContainsNumber.test(value)) {
    return "La contraseña debe tener al menos un digito";
  }

  const isValidLength = /^.{8,16}$/;
  if (!isValidLength.test(value)) {
    return "La longitud de la contraseña debe esta entre 8 y 16 caracteres";
  }

  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
  if (!isContainsSymbol.test(value)) {
    return "La contraseña debe tener al menos un caracter especial";
  }

  return null;
};

export const validarEmail = (correo) => {
  let re = /\S+@\S+\.\S+/;
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (re.test(correo) || regex.test(correo)) {
    return true;
  }
};

