import { response } from "express";
import User from "../models/user.js";
import { createJWT } from "../utils/index.js";
import Notice from "../models/notification.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, title, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        status: false,
        message: "Bu email adresi zaten kullanılıyor"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      title,
      role,
      isAdmin: false,
      isActive: false // Varsayılan olarak pasif
    });

    if (user) {
      user.password = undefined;
      
      res.status(201).json({
        status: true,
        message: "Hesabınız başarıyla oluşturuldu. Admin onayından sonra giriş yapabilirsiniz.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          title: user.title,
          role: user.role,
          isAdmin: user.isAdmin,
          isActive: user.isActive
        }
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Geçersiz kullanıcı bilgileri"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ 
      status: false, 
      message: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Geçersiz email veya şifre." });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message: "Hesabınız henüz aktif değil. Lütfen admin onayını bekleyin.",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      user.password = undefined;

      res.status(200).json({
        status: true,
        message: "Giriş başarılı",
        token,
        userId: user._id,
        role: user.role,
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Geçersiz email veya şifre" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      htttpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name title role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, role } = req.body;

    const user = await User.findById(id);

    if (user) {
      user.name = name || user.name;
      user.title = title || user.title;
      user.role = role || user.role;

      const updatedUser = await user.save();
      updatedUser.password = undefined;

      res.status(200).json({
        status: true,
        message: "Kullanıcı bilgileri başarıyla güncellendi",
        user: updatedUser
      });
    } else {
      res.status(404).json({ 
        status: false, 
        message: "Kullanıcı bulunamadı" 
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ 
      status: false, 
      message: error.message 
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password chnaged successfully.`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// server/controllers/userController.js
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Yetkilendirme hatası! Kullanıcı bulunamadı." });
    }

    const userId = req.user.userId;
    const userProfile = await User.findById(userId).select("-password");

    if (!userProfile) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json(userProfile);
  } catch (error) {
    console.error("⚠️ getUserProfile Hatası:", error.message);
    res.status(500).json({ message: "Kullanıcı bilgisi alınamadı." });
  }
};
