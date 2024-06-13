import { Vinyl } from "./vinyl";

export interface Order {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  vinyl: OrderVinyl;
}

interface OrderVinyl {
  id: string;
  title: string;
  price: number;
}
