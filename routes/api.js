const express = require('express');
const routes = express.Router();
const { createUser, getUsers, delUser, createPost, delPost, getPost, editPost, editUser } = require('../apiControllers');


routes.post("/create-user", createUser);

routes.put("/edit-user/:username", editUser);

routes.get("/users", getUsers);

routes.delete("/del-user/:IdUser", delUser);

routes.post("/create-post/:IdUser", createPost);

routes.delete("/del-post/:IdPost", delPost);

routes.get("/user-posts/:username", getPost);

routes.put("/edit-post/:IdPost", editPost);

module.exports = routes;
