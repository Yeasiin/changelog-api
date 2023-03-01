/**
 * exclude the specific filed from the prisma response
 * we could also do that after getting the response and manually delete
 * but that annoy typescript
 * also this one helps to delete multiple filed at one.
 */

export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
