const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  }
  return true;
};

const isEmpty = (input) => {
  if (input === undefined || input === '') return true;
  if (input.replace(/\s/g, '').length) {
    // globally searching for all types of unicode whitespaces and removing them and if after removing the length is still not 0 then there must be something other than spaces.
    return false;
  }
  return true;
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const empty = (input) => {
  if (input === undefined || input === '') return true;
  return false;
};

module.exports = { validateEmail, validatePassword, isEmpty, empty };
