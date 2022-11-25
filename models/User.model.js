const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required."],
      unique: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "LastName is required."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    image: {
      type: String,
      default: "ironhacklogo.png",
    },
    isManager: {
      type: Boolean,
      default: false,
    },
    createdProjects: {
      type: [Schema.Types.ObjectId],
      ref: "Project",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
