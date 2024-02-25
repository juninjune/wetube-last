import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    return res.send("Database error.");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (video) {
    return res.render("watch", {
      pageTitle: video.title,
      video,
    });
  }

  return res.status(404).render("404", { pageTitle: "Video not found." });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  if (video) {
    return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
  }
  return res.render("404", { pageTitle: "There is no video." });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);

  // Exceptions Check
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }

  // Update Video
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload Video` });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const file = req.file;
  const { title, description, hashtags } = req.body;
  let newVideo = null;
  try {
    newVideo = await Video.create({
      title,
      description,
      fileUrl: file.path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: `Upload Video`,
      errorMessage: error._message,
    });
  }
};

export const getDelete = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const video = await Video.findById(id);

  //Exceptions check
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== user._id) {
    return res.status(403).redirect("/");
  }

  //Delete video from users database
  for (var i = 0; i < user.videos.length; i++) {
    console.log(user.videos[i] === id, i);
    if (user.videos[i] === id) {
      user.videos.splice(i, 1);
    }
  }

  //Delete video from video database
  await Video.findOneAndDelete({ _id: id });
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({ title: { $regex: keyword, $options: "i" } });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
