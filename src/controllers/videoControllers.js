let videos = [
  {
    title: "my video",
    rating: 3,
    comments: 2,
    createdAt: "10 minutes ago",
    views: 10,
    id: 1,
  },
  {
    title: "second video",
    rating: 3,
    comments: 2,
    createdAt: "10 minutes ago",
    views: 1,
    id: 2,
  },
  {
    title: "awsome video",
    rating: 3,
    comments: 2,
    createdAt: "10 minutes ago",
    views: 10,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watch ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  video.title = req.body.title;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload Video` });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
