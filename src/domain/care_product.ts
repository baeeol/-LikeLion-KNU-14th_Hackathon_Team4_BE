import { CareProductType } from 'src/types/CareProductType';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CareProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false, length: 20 })
  brand: string;

  @Column({ unique: true, nullable: false, length: 50 })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false, length: 400 })
  ingredient: string;

  @Column({ nullable: false, length: 400 })
  keyword: string;

  static create(
    type: CareProductType,
    brand: string,
    name: string,
    price: number,
    ingredient: string,
    keyword: string,
  ): CareProduct {
    const newCareProduct = new CareProduct();
    newCareProduct.type = type;
    newCareProduct.brand = brand;
    newCareProduct.name = name;
    newCareProduct.price = price;
    newCareProduct.ingredient = ingredient;
    newCareProduct.keyword = keyword;
    return newCareProduct;
  }
}
