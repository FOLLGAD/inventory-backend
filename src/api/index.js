import { Router } from 'express';

import auth from './auth';
import items from './items';
import containers from './containers';
import users from './users';

export default app => {
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/items', items);
    app.use('/api/v1/users', users);
    app.use('/api/v1/containers', containers);
}