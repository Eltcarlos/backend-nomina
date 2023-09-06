import mongoose from "mongoose";

const raffleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    availableTickets: {
      type: Number,
      required: true,
    },
    soldTickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    participatingUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["open", "closed", "suspend"],
      default: "open",
      trim: true,
    },
    finish_date: {
      type: Number,
    },
    posterImage: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Raffle", raffleSchema);
