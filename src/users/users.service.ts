import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validation(user: User): Promise<ValidationError[]> {
    const validateUser = new User();
    validateUser.username = user.username;
    validateUser.password = user.password;
    return await validate(validateUser);
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      order: { user_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeUsers(users: User[]): Promise<void> {
    for (let length = 0; length < users.length; length++) {
      await this.usersRepository.delete(users[length].user_id);
    }
    return;
  }

  async updateUser(userId: number, userDto: User): Promise<User> {
    const user = new User();
    user.username = userDto.username;
    user.password = userDto.password;
    await this.usersRepository.update(userId, user);
    return await this.findOne(userId);
  }
}
