import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Assuming you have a user service
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // In a real app, you'd return a JWT here
    return {
      message: 'Login successful',
      user,
      // token: this.jwtService.sign(payload)
    };
  }
}
