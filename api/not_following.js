import pool from '../database/mysqlPool.js';

const not_following = async () =>
  new Promise(async (resolve, reject) => {
    let connection = await new Promise(async (_resolve, _) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        _resolve(connection);
      });
    });
    connection.query(
      'select user.id,user.first_name,user.gender from user \
      left join user_subscription on user_subscription.user_id = user.id \
      where user_subscription.id is null',
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

export { not_following };