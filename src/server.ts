import App from '@/app';
import AuthRoute from '@/modules/auth/auth.route';
import IndexRoute from '@/modules/index.route';
import UsersRoute from '@/modules/users/users.route';
import validateEnv from '@utils/validateEnv';
import AmenitiesRoute from './modules/options/amenities/amenities.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new AmenitiesRoute()]);

app.listen();
