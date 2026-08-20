import { CareRoutine } from 'src/app/care_routine/type/care_routine.type';

export type ConflictResultFromRatingNewProduct = {
  conflictMsg: string;
  conflictProduct: {
    id: number;
    category: string;
    brand: string;
    name: string;
  };
};

export class GetRateNewProductReportResponseDto {
  canJoinNow: boolean;
  reason: string;
  data: CareRoutine | ConflictResultFromRatingNewProduct;
}
