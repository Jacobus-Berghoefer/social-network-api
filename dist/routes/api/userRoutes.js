import { Router } from "express";
import userController from "../../controllers/userController.js";
const router = Router();
// Routes for users
router.route("/")
    .get(userController.getUsers) // GET all users
    .post(userController.createUser); // POST a new user
router.route("/:userId")
    .get(userController.getSingleUser) // GET a single user by ID
    .put(userController.updateUser) // PUT update a user
    .delete(userController.deleteUser); // DELETE a user
// Friend routes
router.route("/:userId/friends/:friendId")
    .post(userController.addFriend) // POST add a friend
    .delete(userController.removeFriend); // DELETE remove a friend
export default router;
