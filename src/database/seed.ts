import { createConnection } from 'typeorm';
import { hashSync } from 'bcrypt';

import ormconfig from '../../ormconfig';
import { User } from '../entities/User';

export async function seed(ormconfig: any) {
  const connection = await createConnection(ormconfig);

  const userRepository = connection.getRepository(User);
  const user = new User();
  user.name = 'admin';
  user.role = 'superuser';
  user.password = hashSync('admin', 14);
  await userRepository.save(user);
}

if (require.main === module) {
  seed(ormconfig as any);
}
