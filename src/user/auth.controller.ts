// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // For now, just return user info (omit password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Login successful',
      user: userWithoutPassword,
    };

    // (Optional) later return a JWT token here instead
  }
}
