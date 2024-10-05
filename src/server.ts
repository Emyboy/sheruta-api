import App from '@/app';
import AuthRoute from '@/modules/auth/auth.route';
import IndexRoute from '@/modules/index.route';
import UsersRoute from '@/modules/users/users.route';
import validateEnv from '@utils/validateEnv';
import AmenitiesRoute from './modules/options/amenities/amenities.route';
import CategoriesRoute from './modules/options/categories/categories.route';
import HabitRoute from './modules/options/habits/habit.route';
import InterestRoute from './modules/options/interests/inerests.route';
import LocationsRoute from './modules/options/locations/locations.route';
import PropertyTypesRoute from './modules/options/property_types/property_types.route';
import ServiceRoute from './modules/options/services/service.route';
import StateRoute from './modules/options/state/state.route';

validateEnv();

const app = new App([
    new IndexRoute(), 
    new UsersRoute(), 
    new AuthRoute(), 
    new AmenitiesRoute(), 
    new CategoriesRoute(), 
    new HabitRoute(),
    new InterestRoute(),
    new LocationsRoute(),
    new PropertyTypesRoute(),
    new ServiceRoute(),
    new StateRoute()
]);

app.listen();
