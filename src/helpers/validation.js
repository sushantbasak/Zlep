const { status, errorMessage } = require('./status');

const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  }
  const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;

  return re.test(password);
};

const isNotEmpty = (input) => {
  if (input === undefined || input === '') return false;
  if (input.replace(/\s/g, '').length) {
    // globally searching for all types of unicode whitespaces and removing them and if after removing the length is still not 0 then there must be something other than spaces.
    return true;
  }
  return false;
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

const validUser = (req, res, next) => {
  const data = req.body;

  let p = Boolean(true);

  // eslint-disable-next-line consistent-return
  Object.entries(data).forEach(([key, value]) => {
    p = p && isNotEmpty(value);

    if (key === 'email') p = p && validateEmail(value);

    if (key === 'password') p = p && validatePassword(value);

    if (p === false) return res.status(status.bad).send({ ...errorMessage, msg: 'Invalid Input data' });
  });

  next();
};

const validUpload = (req, res, next) => {
  const data = req.body;

  let p = Boolean(true);

  Object.entries(data).forEach(([, value]) => {
    p = p && isNotEmpty(value);

    if (p === false) return res.status(status.bad).send({ ...errorMessage, msg: 'Invalid Input data' });
  });

  next();
};

module.exports = { validateEmail, validatePassword, isNotEmpty, empty, validUser, validUpload };
