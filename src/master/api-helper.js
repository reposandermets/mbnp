module.exports.isPostReviewPayloadInvalid = (body) => {
  console.log(body);
  if (
    !body
    || body !== Object(body)
    || !Object.keys(body).length) {
    return {
      invalid: true,
      message: 'INVALID_PAYLOAD',
    };
  }

  const {
    productid,
    name,
    email,
    review,
  } = body;
  if (!review || !(review.length > 1 && review.length < 3851)) {
    return {
      invalid: true,
      message: 'INVALID_REVIEW',
    };
  }

  if (!name || name.length < 2) {
    return {
      invalid: true,
      message: 'INVALID_NAME',
    };
  }

  if (!email) {
    return {
      invalid: true,
      message: 'INVALID_EMAIL',
    };
  }

  if (!productid) {
    return {
      invalid: true,
      message: 'INVALID_PRODUCTID',
    };
  }

  const atPos = email.indexOf('@');
  const dotPos = email.lastIndexOf('.');
  if (atPos < 1 || dotPos < (atPos + 2) || (dotPos + 2) >= email.length) {
    return {
      invalid: true,
      message: 'INVALID_EMAIL',
    };
  }

  const productidInt = parseInt(productid, 10);
  if (!(productid === String(productidInt) && productidInt > 0)) {
    return {
      invalid: true,
      message: 'INVALID_PRODUCTID',
    };
  }

  return { invalid: false };
};
