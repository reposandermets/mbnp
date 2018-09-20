const DI = require('../dependency-injection');
const config = require('../config');

const db = {};

db.connectPool = async () => {
  db.pool = DI.newPool();

  const dataBaseExistsSql = `
    SELECT exists(
      SELECT datname
      FROM pg_catalog.pg_database
      WHERE datname = $1
    )`;

  const { rows } = await db.pool
    .query(dataBaseExistsSql, [config.db.database]);

  const [row] = rows;
  if (row.exists) {
    return { success: true };
  }

  throw new Error(`Database ${config.db.database} not found`);
};

db.closeConnection = async () => db.pool.end();

db.saveReview = async ({
  productid,
  name,
  email,
  review,
}) => {
  try {
    const checkProductExistsSql = `
      SELECT productid
      FROM production.product
      WHERE productid = $1`;

    const { rows: productRows } = await db.pool
      .query(checkProductExistsSql, [productid]);

    if (!productRows.length) {
      return { success: false, message: 'INVALID_PRODUCTID' };
    }

    const insertReviewSQL = `
      INSERT INTO production.productreview(
        productreviewid, productid, reviewername, emailaddress, comments)
      VALUES
        (DEFAULT, $1, $2, $3, $4)
          RETURNING productreviewid;`;

    const { rows: productReviewRows } = await db.pool
      .query(insertReviewSQL, [productid, name, email, review]);

    if (productReviewRows.length) {
      return { success: true, data: productReviewRows[0] };
    }
    console.log('CRITICAL: db saveReview !productReviewRows.length', productReviewRows);
    return { success: false, message: 'SERVER_ERROR' };
  } catch (error) {
    console.log('CRITICAL: db saveReview', error);
    return { success: false, message: 'SERVER_ERROR' };
  }
};

db.updateReviewBadWords = async (
  productreviewid,
) => {
  try {
    const updateReviewSQL = `
      UPDATE production.productreview
      SET prohibitedwords = TRUE
      WHERE productreviewid = $1;`;

    const { rows: productReviewRows } = await db.pool
      .query(updateReviewSQL, [productreviewid]);

    if (productReviewRows.length) {
      return { success: true, data: productReviewRows[0] };
    }
    console.log('CRITICAL: db updateReviewBadWords expected productReviewRows not returned');
    return { success: false };
  } catch (error) {
    console.log('CRITICAL: db updateReviewBadWords', error);
    return { success: false, message: 'SERVER_ERROR' };
  }
};

db.getReviews = async () => {
  try {
    const updateReviewSQL = `
      SELECT * FROM production.productreview
      ORDER BY productreviewid DESC LIMIT 100`;

    const { rows: data } = await db.pool.query(updateReviewSQL);

    return { success: true, count: data.length, data };
  } catch (error) {
    console.log('CRITICAL: db getReviews', error);
    return { success: false, message: 'SERVER_ERROR' };
  }
};

module.exports = db;
