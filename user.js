const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [
        {
            title: {
                type: String
            },
            description: {
                type: String
            },
            deadline: {
                type: String
            },
            priority: {
                type: String
            },
            status: {
                type: String
            }
        }
    ]
});

const User = mongoose.model('user', userSchema);
module.exports = User;