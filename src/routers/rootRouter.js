import express from "express";
import {
  home,
  search,
  getUploadText,
  postUploadText,
} from "../controllers/videoControllers";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userControllers";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);
rootRouter
  .all(protectorMiddleware)
  .route("/uploadtext")
  .get(getUploadText)
  .post(avatarUpload.single("file"), postUploadText);

export default rootRouter;
