import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSkinType {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.skinType)
  @JoinColumn()
  user: User;

  @Column()
  type: number;

  static create(user: User, type: number): UserSkinType {
    const newUserSkinType = new UserSkinType();
    newUserSkinType.user = user;
    newUserSkinType.type = type;
    return newUserSkinType;
  }
}
