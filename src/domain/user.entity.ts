import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSkinType } from './user_skin_type.entity';
import { CareProduct } from './care_product';
import { UserRoutine } from './user_routine';

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

  @ManyToMany(() => CareProduct)
  @JoinTable()
  ownedProducts: CareProduct[];

  @OneToMany(() => UserRoutine, (userRoutine) => userRoutine.user)
  routines: UserRoutine[];

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
