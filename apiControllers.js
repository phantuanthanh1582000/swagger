const { UserModel, postModel } = require('./mongoose.js');

const createUser = async (req, res) => {
    const { username, password, email } = req.body;
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ error: "Username đã tồn tại" });
    }
    if (!username) {
        return res.status(400).json({ error: "Chưa có username" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
        return res.status(400).json({ error: "Chưa có password" });
    } else if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Mật khẩu phải bao gồm ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt"
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return res.status(400).json({ error: "Chưa có email" });
    } else if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email không hợp lệ" });
    }

    try {
        const result = await UserModel.create({ username: username, password: password, email: email })
        
        
        return res.status(200).json({ message: "Thêm thành công" });
    } catch (error) {
        
        return res.status(500).json({ error: "Đã xảy ra lỗi khi thêm dữ liệu" });
    }
}

const getUsers = async (req, res) => {
    await UserModel.find({})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.send('Không thành công')
        })    
}

const delUser = async (req, res) => {
    const IdUser = req.params.IdUser;

    try {
        const user = await UserModel.findById(IdUser);
        if (!user) {
            return res.status(404).send('Người dùng không tồn tại');
        }

        await UserModel.deleteOne({ _id: IdUser });
        return res.send('Xóa thành công');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Đã xảy ra lỗi khi xóa người dùng');
    }
}

const createPost = async (req, res) => {
    const { title, content } = req.body;
    const id_user = req.params.IdUser;
    if (!id_user) {
        
        return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
    else {
        const newPost = await postModel.create({ title: title, content: content, id_user: id_user })

        const user = await UserModel.findById(id_user);
        user.posts.push(newPost._id);
        await user.save();
        return res.status(201).json({ message: "Tạo bài đăng thành công", post: newPost });
    }
}

const delPost = async (req, res) => {
    const IdPost = req.params.IdPost;
    const user = await UserModel.findOne({posts: IdPost});
    const index = user.posts.indexOf(IdPost);
    if (index !== -1) {
        user.posts.splice(index, 1);
    }
    await user.save();
    await postModel.deleteOne({ _id: IdPost });
    return res.send("Xóa post thành công");
}

const getPost = async (req, res) => {
    try {
        const username = req.params.username;
        
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send("Người dùng không tồn tại");
        }

        const userPosts = await postModel.find({ _id: { $in: user.posts } });

        return res.json({ user, userPosts });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Lỗi server");
    }
}

const editPost = async (req, res) => {
    const IdPost = req.params.IdPost;
    const { title, content } = req.body;
    await postModel.updateOne(
        { _id: IdPost },
        { $set: { title: title, content: content } }
    );
    return res.status(201).json({ message: "Cập nhật post thành công" });
}

const editUser = async (req, res) => {
    const username = req.params.username;
    const { password, email } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password) {
        if(!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Mật khẩu phải bao gồm ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt"
            });
        }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email không hợp lệ" });
        }
    }
    await UserModel.updateOne(
        { username: username },
        {$set:{password: password, email: email}}
    );
    return res.status(201).json({ message: "Cập nhật user thành công" });
}

module.exports = { createUser, getUsers, delUser, createPost, delPost, getPost, editPost, editUser }