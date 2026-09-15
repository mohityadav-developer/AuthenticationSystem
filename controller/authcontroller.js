import User from "../models/userschema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  const isalreadyexist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isalreadyexist) {
    res.status(409).send("User or email already exist ");
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedpassword,
  });
  const accesstoken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  const refreshtoken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: "user created successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accesstoken,
  });
}

export async function refreshToken(req, res) {
  const refreshtoken = req.cookies.refreshtoken;
  if (!refreshtoken) {
    res.status(401).send("RefreshToken Not found");
  }
  const decoded = jwt.verify(refreshtoken, config.JWT_SECRET);
  const accesstoken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const newrefreshtoken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("refreshtoken", newrefreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).send("Access token refreshed successfully");
}

export async function getme(req, res) {
  // ? means only call .split(" ") if req.headers.authorization actually exists.-->optional chaining
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send("Token not found");
  }
  const decoded = jwt.verify(token, config.JWT_SECRET);
  console.log(decoded);
  const userdata = await User.findById(decoded.id);

  res.status(200).json({
    message: "user fetched successfully",
    username: userdata.username,
    email: userdata.email,
  });
}
