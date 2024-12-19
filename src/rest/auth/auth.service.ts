import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../../cache/user/user.repository";
import { Role } from "../../gateway/shared-types/roles";
import { UserModel } from "../../cache/user/user.model";

export interface JwtPayload {
  sub: string;
  roles: Role[];
  name: string | undefined;
  avatar: string | undefined;
  version?: "1";
}

@Injectable()
export class AuthService {
  // Seconds
  public static REFRESH_TOKEN_EXPIRES_IN = "4d";
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  public async refreshToken(token: string) {
    const oldToken = this.jwtService.decode<JwtPayload>(token);
    return this.createJwtPayload(oldToken.sub).then((payload) =>
      this.jwtService.sign(payload, {
        expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN,
      }),
    );
  }

  public async createToken(
    steam_id: string,
    name?: string,
    avatar?: string,
    expiresIn = AuthService.REFRESH_TOKEN_EXPIRES_IN,
  ) {
    const payload = await this.createJwtPayload(steam_id, name, avatar);
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  private async createJwtPayload(
    steam_id: string,
    name?: string,
    avatar?: string,
  ): Promise<JwtPayload> {
    const u: UserModel | undefined =
      await this.userRepository.resolve(steam_id);
    return {
      sub: steam_id,
      roles: u?.roles || [Role.PLAYER],
      name: name || u?.name,
      avatar: avatar || u?.avatar,
      version: "1",
    };
  }
}
