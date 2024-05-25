import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
});

export const User = mongoose.model('User', userSchema);