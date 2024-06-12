import { Genre } from "@yonraztickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface VinylAttributes {
  title: string;
  description?: string;
  genre: Genre;
  price: number;
  userId: string;
  imageUrl: string;
}

interface VinylDocument extends mongoose.Document {
  title: string;
  price: number;
  description: string;
  genre: Genre;
  userId: string;
  version: number;
  imageUrl: string;
  orderId?: string;
}

export interface VinylModel extends mongoose.Model<VinylDocument> {
  build(attributes: VinylAttributes): VinylDocument;
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
    },
    userId: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      enum: Object.values(Genre),
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, returnedObject) {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
      },
    },
  }
);

vinylSchema.statics.build = (attributes: VinylAttributes) => {
  return new Vinyl(attributes);
};

vinylSchema.set("versionKey", "version");
vinylSchema.plugin(updateIfCurrentPlugin);

export const Vinyl = mongoose.model<VinylDocument, VinylModel>(
  "Vinyl",
  vinylSchema
);
