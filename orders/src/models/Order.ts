import mongoose from "mongoose";
import { VinylDocument } from "./Vinyl";
import { OrderStatus } from "@yonraztickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  vinyl: VinylDocument;
}

interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  vinyl: VinylDocument;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attributes: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    vinyl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vinyl",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttributes) => {
  return new Order(attrs);
};
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);
export { Order };
