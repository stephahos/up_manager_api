const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const projectSchema = new Schema(
  {
    number: {
      type: String,
      required: [true, "Project number is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required."],
    },
    country: {
      type: String,
      enum: [
        "AFGHANISTAN",
        "ALBANIA",
        "ALGERIA",
        "ANGOLA",
        "ANGUILLA",
        "BRAZIL",
        "BENIN",
        "GERMANY",
        "IRAN",
        "NORWAY",
      ],
    },
    geographicalZone: {
      type: String,
      enum: [
        "Europe",
        "Middle East",
        "Asia",
        "Africa",
        "South America",
        "North America",
      ],
    },
    address: {
      type: String,
    },
    activity: {
      type: String,
      enum: [
        "Drinking Water",
        "Waste Water",
        "Electricity",
        "Energy Efficiency",
        "District Energy",
        "Waste",
        "Other Activity",
      ],
    },
    service: {
      type: String,
      enum: [
        "Design and Supervision",
        "General Studies",
        "Digital Services",
        "Asset Management",
        "Technical and Commercial Losses",
        "Strategic and Operational Assistance",
      ],
    },
    status: {
      type: String,
      enum: [
        "In preparation",
        "Submitted",
        "Awarded",
        "Signed",
        "Lost",
        "Abandoned",
        "Canceled",
      ],
    },
    deadLine: {
      type: Date,
    },
    createdBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    contributor: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    validationStatus: {
      type: String,
      default: "pending",
      enum: ["validated", "rejected"],
    },
    validatedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Project = model("Project", projectSchema);

module.exports = Project;
