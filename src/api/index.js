import { Router } from 'express';

import auth from './routes/auth';
import items from './routes/items';
import containers from './routes/containers';
import users from './routes/users';
import itemTypes from './routes/item-types';

export default app => {
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/items', items);
    app.use('/api/v1/users', users);
    app.use('/api/v1/containers', containers);
    app.use('/api/v1/item-types', itemTypes);
}