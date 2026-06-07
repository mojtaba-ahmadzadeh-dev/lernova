export type courseItem = {
    id: string;
    courseId: string;
    title:string;
    price:number;
    finalPrice:number
    discountAmount:number;
    isFree:boolean;
    isPublished:boolean;
}

export type BasketType = {
    courses: courseItem[];
    totalPrice:number;
    totalDiscountAmount:number;
    finalAmount:number;
}