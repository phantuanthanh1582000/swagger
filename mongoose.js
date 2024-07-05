const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/SOCIALMEDIA').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    posts: {
        type: [String],
        default: []
    }
}, {
    collection: "Users"
});

const postSchema = new Schema({
    title: {
        type: String,
        default: null
    },
    content: {
        type: String,
        default: null
    },
    id_user: {
        type: String,
        required: true
    }
}, {
    collection: "Posts"
});


const UserModel = mongoose.model('user', userSchema);
const postModel = mongoose.model('post', postSchema);

module.exports = {UserModel, postModel}
