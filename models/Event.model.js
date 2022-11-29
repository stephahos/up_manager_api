const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required."],
    },
    eventAddress: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
    },
    topic: {
      type: String,
      enum: [
        "Project presentation",
        "Offer Review",
        "Commitment committee",
        "Contract signature",
        "Partners meeting",
        "Project Opening",
      ],
    },
    projectsReviewed: {
      type: [Schema.Types.ObjectId],
      ref: "Project",
    },
    image: {
      type: String,
      default: "ironhacklogo.png",
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    createdBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
