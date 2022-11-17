import pool from '../database/mysqlPool.js';

const max_following = async () =>
  new Promise(async (resolve, reject) => {
    let connection = await new Promise(async (_resolve, _) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        _resolve(connection);
      });
    });
    connection.query(
      'select user_id, count(*) as `Count of subscriptions` \
      from user_subscription \
      group by user_id \
      order by count(*) desc, user_id ASC \
      limit 5',
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

export { max_following };
