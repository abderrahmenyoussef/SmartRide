const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ['conducteur', 'passager'],
        lowercase: true
    }
},
{   
    timestamps: true ,
    collection:"users"
}
);

module.exports = mongoose.model('User', userSchema);
