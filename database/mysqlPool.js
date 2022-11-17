import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'test_db',
});

const CREATE_USER_TABLE_SQL = `CREATE TABLE IF NOT EXISTS user (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(20) NOT NULL,
    gender VARCHAR(6) NOT NULL,
	PRIMARY KEY (id)
)`;

const CREATE_USER_SUBSCRIPTION_TABLE_SQL = `CREATE TABLE IF NOT EXISTS user_subscription (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscribe_target INT NOT NULL,
	PRIMARY KEY (id)
)`;

pool.getConnection((err, connection) => {
  if (!err) {
    console.log('Connected to the MySQL DB - ID is ' + connection.threadId);

    connection.query(CREATE_USER_TABLE_SQL, (err) => {
      if (!err) console.log('Users table was created');
      else console.log(err);
    });

    connection.query(CREATE_USER_SUBSCRIPTION_TABLE_SQL, (err) => {
      if (!err) console.log('Users subscription table was created');
      else console.log(err);
    });

    connection.release();
  }
});

export default pool;
