const mongoose = require("mongoose");
const validator = require("validator"); //importing npm validator.
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//Schema is created
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type.`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data not valid.");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://as2.ftcdn.net/v2/jpg/00/65/77/27/1000_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
      maxLength: 120,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//Logic for creating JWT
userSchema.methods.getJWT = async function () {
  const user = this; //"this" will not work under arrow function, So don't make it an arrow function.
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER0212", {
    expiresIn: "7d", //token will be expired in 7days,we can use 1h for 1 hour.
  });
  return token;
};

//Logic to verify the password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  ); //bcrypt.compare(userenteredPassword, HashPasswordInDatabase)
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema); //will return model naming User.
