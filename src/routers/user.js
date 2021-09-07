const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeMessage, sendDeactivationMessage }= require("../emails/account");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeMessage(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// end point to delete a user itself
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendDeactivationMessage(req.user.email, req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  //dest: "avatar", // dest=> destination
  limits: {
    fileSize: 1000000, // for one byte "add six zeros"
  },
  // cb stands for "call back"
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error("File must be either png, jpg or jpeg"));
    }

    cb(undefined, true);
    // cb(undefined, false)
  },
});

// end point to allow user to upload its pic/avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("upload"),
  async (req, res) => {
    // getting a buffer from sharp library
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    //req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send("Avatar uploaded sucessfully!");
  },
  (error, req, res, next) => {
    res.status(400).json({
      error: error.message,
    });
  }
);

// end point to allow user to delete the uploaded avatar
router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    if (!!req.user.avatar) {
      req.user.avatar = undefined;
      await req.user.save();
      res.send("Avatar deleted Successfully");
    } else {
      res.send("No Avatar found");
    }
  },
  (error, req, res, next) => {
    res.status(400).json({
      error: error.message,
    });
  }
);

// end point to get the avatar of user
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    // setting header
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
});

module.exports = router;
