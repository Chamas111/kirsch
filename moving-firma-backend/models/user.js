const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
    },
  },
  { timestamps: true }
);

UserSchema.virtual("confirmPassword")
  .get(() => this._confirmPassword)
  .set((value) => (this._confirmPassword = value));

UserSchema.pre("validate", function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate("ConfirmPassword", "Password must match!");
  }
  next();
});

UserSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 8);
    console.log("hhhhhhhhhhhhhhhhhhhhh", hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("error", "hashing error");
    next(error);
  }
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
