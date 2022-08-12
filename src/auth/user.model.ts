import { User } from '@prisma/client';

type CreatedUserModel = Pick<User, 'username' | 'createdAt'>;

export { User as UserModel, CreatedUserModel };
