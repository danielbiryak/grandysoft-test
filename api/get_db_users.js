import pool from '../database/mysqlPool.js';

const get_users_subscriptions = async () =>
  new Promise(async (resolve, reject) => {
    let connection = await new Promise(async (_resolve, _) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        _resolve(connection);
      });
    });
    connection.query(
      'select * from user join user_subscription on user.id = user_subscription.user_id',
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

export { get_users_subscriptions };
