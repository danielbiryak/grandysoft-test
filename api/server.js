import express from 'express';
import cors from 'cors';
import { fill_db_subscriptions, fill_db_users } from './fill_db.js';
import { get_users_subscriptions } from './get_db_users.js';
import { get_user_info } from './get_user_info.js';
import { max_following } from './max_following.js';
import { not_following } from './not_following.js';

const PORT = '3000';

const server = express();
server.use(cors());

server.get('/', async (req, res) => {
  // let result_users = await fill_db_users(200);
  // let result_subscriptions = await fill_db_subscriptions(150);
  res.status(200).json({
    test: 'OK!',
  });
});

server.get('/users', async (req, res) => {
  const users = await get_users_subscriptions();
  res.status(200).json({ users: users });
});

server.get('/users/:id/friends', async (req, res) => {
  const user_id = req.params.id;
  const order_by = req.query.order_by ?? undefined;
  const order_type = req.query.order_type ?? undefined;

  const user_info = await get_user_info(user_id, order_by, order_type);

  res.status(200).json(user_info);
});

server.get('/max-following', async (req, res) => {
  const result_info = await max_following();
  res.status(200).json(result_info);
});

server.get('/not-following', async (req, res) => {
  const result_users = await not_following();

  res.status(200).json(result_users);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
