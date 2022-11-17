import pool from '../database/mysqlPool.js';

const humans = [
  { first_name: 'Cary', gender: 'Male' },
  { first_name: 'Bernard ', gender: 'Male' },
  { first_name: 'Eddie', gender: 'Male' },
  { first_name: 'Sam', gender: 'Male' },
  { first_name: 'Otis ', gender: 'Male' },
  { first_name: 'Clarence', gender: 'Male' },
  { first_name: 'Preston', gender: 'Male' },
  { first_name: 'Milton', gender: 'Male' },
  { first_name: 'Sean', gender: 'Male' },
  { first_name: 'Fredrick', gender: 'Male' },
  { first_name: 'Yvette', gender: 'Female' },
  { first_name: 'Virginia', gender: 'Female' },
  { first_name: 'Jo', gender: 'Female' },
  { first_name: 'Carrie', gender: 'Female' },
  { first_name: 'Natasha', gender: 'Female' },
  { first_name: 'Joanne', gender: 'Female' },
  { first_name: 'Pauline', gender: 'Female' },
  { first_name: 'Gail', gender: 'Female' },
  { first_name: 'Miranda', gender: 'Female' },
  { first_name: 'Olivia', gender: 'Female' },
];

const fill_db_users = async (count) =>
  new Promise(async (resolve, reject) => {
    let connection = await new Promise(async (_resolve, _) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        _resolve(connection);
      });
    });
    let query = 'insert into user(first_name, gender) values ';
    for (let i = 1; i <= count; i++) {
      const random_number = Math.floor(Math.random() * humans.length);
      query += `('${humans[random_number].first_name}','${humans[random_number].gender}'),`;
    }
    query = query.slice(0, query.length - 1);
    let query_result = await new Promise(async (_resolve, _) => {
      connection.query(query, (err, result) => {
        if (err) reject(err);
        _resolve(result);
      });
    });

    console.log('generate_data.js::LOG\n', query_result);
    resolve(query_result);
  });

const fill_db_subscriptions = async (count) =>
  new Promise(async (resolve, reject) => {
    let connection = await new Promise(async (_resolve, _) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        _resolve(connection);
      });
    });

    let users_id = await new Promise(async (_resolve, _) => {
      connection.query('select id from user', (err, result) => {
        console.log(result);
        if (err) reject(err);
        else _resolve(result);
      });
    });

    let query =
      'insert into user_subscription(user_id, subscribe_target) values ';

    for (let i = 1; i <= count; i++) {
      const user_id = Math.floor(Math.random() * users_id.length);

      let subscribe_target = Math.floor(Math.random() * users_id.length);
      while (user_id === subscribe_target)
        subscribe_target = Math.floor(Math.random() * users_id.length);

      query += `(${users_id[user_id].id},${users_id[subscribe_target].id}),`;
    }

    query = query.slice(0, query.length - 1);
    let query_result = await new Promise(async (_resolve, _) => {
      connection.query(query, (err, result) => {
        if (err) reject(err);
        _resolve(result);
      });
    });

    console.log('fill_db_subscriptions::LOG\n', query_result);
    resolve(query_result);
  });
export { fill_db_users, fill_db_subscriptions };
