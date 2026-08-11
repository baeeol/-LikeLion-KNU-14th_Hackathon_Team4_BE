import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
