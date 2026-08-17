import { CareProductType } from 'src/types/CareProductType';

type CareProduct = {
  id: number;
  category: CareProductType;
  brand: string;
  name: string;
  price: number;
};

export class GetCareProductByKeywordResponseDto {
  products: CareProduct[];
}
