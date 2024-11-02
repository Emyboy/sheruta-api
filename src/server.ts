import App from "@/app";
import validateEnv from "@utils/validateEnv";
import AuthRoute from "@/modules/auth/auth.route";
import IndexRoute from "@/modules/index.route";
import UsersRoute from "@/modules/users/users.route";
import AmenitiesRoute from "./modules/flat-share/options/amenities/amenities.route";
import CategoriesRoute from "./modules/flat-share/options/categories/categories.route";
import HabitRoute from "./modules/flat-share/options/habits/habit.route";
import InterestRoute from "./modules/flat-share/options/interests/interests.route";
import LocationsRoute from "./modules/flat-share/options/locations/locations.route";
import PropertyTypesRoute from "./modules/flat-share/options/property_types/property_types.route";
import ServiceRoute from "./modules/flat-share/options/services/service.route";
import StateRoute from "./modules/flat-share/options/state/state.route";
import WorkIndustriesRoute from "./modules/flat-share/options/work_industry/work-industry.route";
import UserInfoRoute from "./modules/user-info/user-info.route";
import FlatShareProfileRoute from "./modules/flat-share/flat-share-profile/flat-share-profile.route";
import UserSettingsRoute from "./modules/user-settings/user-settings.route";
import FlatShareRequestRoute from "./modules/flat-share/flat-share-requests/flat-share-request.route";
import NotificationsRoute from "./modules/notifications/notifications.route";
import ConversationRoute from "./modules/messages/conversations/conversations.route";
import MessagesRoute from "./modules/messages/messages.route";
import TransactionRoute from "./modules/wallet/transactions/transaction.route";
import PromotionRoute from "./modules/promotions/promotions.route";

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
  new StateRoute(),
  new WorkIndustriesRoute(),
  new UserInfoRoute(),
  new FlatShareProfileRoute(),
  new FlatShareRequestRoute(),
  new UserSettingsRoute(),
  new NotificationsRoute(),
  new ConversationRoute(),
  new MessagesRoute(),
  new TransactionRoute(),
  new PromotionRoute(),
]);

app.listen();
