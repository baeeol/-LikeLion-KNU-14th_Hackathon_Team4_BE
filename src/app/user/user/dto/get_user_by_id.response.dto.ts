type skinTypeField = {
  type: '건성' | '지성' | '복합성' | '수부지' | '미정';
};

export class GetUserByIdResponseDto {
  id: number;
  nickname: string;
  age: number;
  skinType: skinTypeField;
}
