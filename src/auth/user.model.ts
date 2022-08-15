import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

class UserSerialized implements User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export { User as UserModel, UserSerialized };
