import { Router } from 'express';

import auth from './routes/auth';
import items from './routes/items';
import containers from './routes/containers';
import itemTypes from './routes/item-types';
import users from './routes/users';
import me from './routes/me';

export default app => {
    app.use('/v1/auth', auth);
    app.use('/v1/users', users);
    app.use('/v1/me', me);
    app.use('/v1/items', items);
    app.use('/v1/containers', containers);
    app.use('/v1/item-types', itemTypes);
}