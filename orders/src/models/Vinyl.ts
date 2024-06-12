import mongoose from "mongoose";
import { Order } from "./Order";
import { OrderStatus } from "@yonraztickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface VinylAttributes {
  id: string;
  title: string;
  price: number;
}

export interface VinylDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface VinylModel extends mongoose.Model<VinylDocument> {
  build(attrs: VinylAttributes): VinylDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<VinylDocument | null>;
}

const vinylSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    version: {
      type: Number,
      default: 1,
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

vinylSchema.statics.build = (attrs: VinylAttributes) => {
  return new Vinyl({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};
vinylSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Vinyl.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

vinylSchema.methods.isReserved = async function () {
  const reserved = await Order.findOne({
    vinyl: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ],
    },
  });
  return !!reserved;
};

vinylSchema.set("versionKey", "version");
vinylSchema.plugin(updateIfCurrentPlugin);

const Vinyl = mongoose.model<VinylDocument, VinylModel>("Vinyl", vinylSchema);
export { Vinyl };
