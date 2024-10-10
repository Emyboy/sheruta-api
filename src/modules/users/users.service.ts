import userModel from '@/modules/users/users.model';
import { UpdateUserDTO } from './users.dto';

class UserService {
  public users = userModel;

  public update = async ({ data, user_id }: { user_id: string; data: UpdateUserDTO }) => {
    try {
      const findAllUsersData = await this.users.findOneAndUpdate({ _id: user_id }, { ...data }, { new: true });
      return findAllUsersData;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
