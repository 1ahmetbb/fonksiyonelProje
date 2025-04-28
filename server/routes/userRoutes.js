import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);

router.get("/profile", protectRoute, getUserProfile); //ekle
router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// Profil bilgilerini güncellemek için (isim, rol, unvan)
router.put("/profile/:id", protectRoute, updateUserProfile);

// Sadece aktif/pasif yapmak için
router.put("/:id/activate", protectRoute, isAdminRoute, activateUserProfile);

// Kullanıcı silmek için
router.delete("/:id", protectRoute, isAdminRoute, deleteUserProfile);

// Kullanıcıları döndüren yeni endpoint
router.get("/all", protectRoute, getTeamList); 

export default router;
