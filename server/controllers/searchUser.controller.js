import UserModel from "../models/User.model.js";

async function searchUser(req, res) {
  try {
    const { searchUser } = req.body;
    const query = new RegExp(searchUser, 'i', 'g');
    // console.log("query", query);
    // console.log("searchUser", searchUser);
    const user = await UserModel.find({
      "$or": [
        { name: query },
        { email: query },
      ]
    }).select('-password');
    if (!user) {
      return res.status(200).json({ success: true, message: "user not found!", users: user })
    }
    // console.log(user);
    return res.status(200).json({ success: true, message: "fetched all users from the database", users: user })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || error });
  }
}

export default searchUser;