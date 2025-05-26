import { Role } from "../gateway/shared-types/roles";

export const isOld = (roles: Role[]): boolean => {
  return (
    roles.includes(Role.OLD) ||
    roles.includes(Role.MODERATOR) ||
    roles.includes(Role.ADMIN)
  );
};
