type CareProduct = {
  id: number;
  category: string;
  brand: string;
  name: string;
};

export class GetAllOwnedProductResponseDto {
  products: CareProduct[];
}
