const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "LastName is required."],

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
      default:
        "https://cdn-icons-png.flaticon.com/512/1250/1250689.png?w=826&t=st=1669674003~exp=1669674603~hmac=a30a84d9ca89cb8f87b774d921d2b9cec081e33718e6c87761ad4e3d1c0f245e",
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
