import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CareProduct } from './care_product';

type TimeType = 0 | 1;

@Entity()
export class UserRoutine {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.routines)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CareProduct)
  @JoinColumn({ name: 'product_id' })
  careProduct: CareProduct;

  @Column({ nullable: false })
  weekday: number;

  @Column({ nullable: false })
  time: number;

  @Column({ nullable: false })
  order: number;

  @Column({ nullable: false })
  volume: number;

  static create(
    user: User,
    careProduct: CareProduct,
    weekday: number,
    time: TimeType,
    order: number,
    volume: number,
  ): UserRoutine {
    const newUserRoutine = new UserRoutine();
    newUserRoutine.user = user;
    newUserRoutine.careProduct = careProduct;
    newUserRoutine.weekday = weekday;
    newUserRoutine.time = time;
    newUserRoutine.order = order;
    newUserRoutine.volume = volume;
    return newUserRoutine;
  }
}
