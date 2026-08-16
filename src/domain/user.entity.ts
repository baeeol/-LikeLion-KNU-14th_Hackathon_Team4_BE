import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserSkinType } from './user_skin_type.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 12 })
  nickname: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @OneToOne(() => UserSkinType, (userSkinType) => userSkinType.user)
  skinType: UserSkinType;

  static create(
    nickname: string,
    age: number,
    password: string,
    salt: string,
  ): User {
    const newUser = new User();
    newUser.nickname = nickname;
    newUser.age = age;
    newUser.password = password;
    newUser.salt = salt;
    return newUser;
  }
}
