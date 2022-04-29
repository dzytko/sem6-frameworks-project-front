export interface ProductType {
    _id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountedUnitPrice: number | null;
    isDiscounted: boolean;
    isDiscontinued: boolean;
    imagePath: string | null;
    categoryId: string | null;
    properties: Object | null;
}