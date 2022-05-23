export interface OrderType {
    _id: string,
    deliveryMethod: string,
    paymentMethod: string,
    firstName: string,
    lastName: string,
    email: string,
    street: string,
    postalCode: string,
    city: string,
    phoneNumber: string,
    orderDate: string,
    orderItems: Array<{
        productId: string,
        quantity: number,
    }>
}