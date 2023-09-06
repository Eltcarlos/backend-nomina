import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    raffle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
