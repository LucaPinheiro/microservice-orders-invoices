export interface OrderCreatedMessage {
  orderId: string;
  amount: number;
  customer: {
    id: string;
  };
  status: string
  createdAt: Date;
}
