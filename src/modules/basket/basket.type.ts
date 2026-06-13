// پیدا کنید کجا تعریف شده و فیلد quantity را اضافه کنید
export type courseItem = {
  courseId: number;
  price: number;
  finalPrice: number;
  quantity: number; // این خط را اضافه کنید
  // ... سایر فیلدها مثل title و غیره
}

export type BasketType = {
  totalPrice: number;
  totalDiscountAmount: number;
  finalAmount: number;
  courses: courseItem[];
}
