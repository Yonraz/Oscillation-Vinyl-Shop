import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

export interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attributes: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
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

ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);
