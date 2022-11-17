import pool from '../database/mysqlPool.js';

const get_user_info = async (user_id, order_by, order_type) =>
  new Promise(async (resolve, reject) => {
    let connection = await new Promise(async (_resolve, _) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        _resolve(connection);
      });
    });

    let potential_friends = await new Promise(async (_resolve, _) => {
      connection.query(
        `select user_id from user_subscription \
        where subscribe_target = ${user_id} \
        order by user_id`,
        (err, result) => {
          if (err) reject(err);
          console.log('get_user_info::LOG:potential_friends:\n', result);

          _resolve(result);
        }
      );
    });

    let query = `select * from user \
    join user_subscription on user.id = user_subscription.user_id \
    where user.id = ${user_id} `;

    if (order_by !== undefined) {
      query += `order by user_subscription.${order_by} `;
      if (order_type !== undefined) query += `${order_type}`;
    }

    const user_subscriptions = await new Promise(async (_resolve, _) => {
      connection.query(query, (err, result) => {
        if (err) reject(err);
        console.log('get_user_info::LOG\n', result);
        _resolve(result);
      });
    });

    const friends = [];

    for (const item of user_subscriptions) {
      const temp = potential_friends.filter(
        (potential_friend) => potential_friend.user_id === item.subscribe_target
      );
      if (temp[0] !== undefined) friends.push(...temp);
    }
    const result_list = [];
    for (const item of friends) {
      const temp = user_subscriptions.filter(
        (user_subscription) =>
          user_subscription.subscribe_target === item.user_id
      );
      if (temp[0] !== undefined) result_list.push(...temp);
    }
    if(result_list[0] === undefined) resolve({Message: 'There\'s no friends'})
    resolve(result_list);
  });

export { get_user_info };
