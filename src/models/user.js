import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, '사용자 이름을 입력해주세요'],
    },
    email: {
        type: String,
        required: [true, '이메일을 입력해주세요'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, '비밀번호를 입력해주세요'],
        minlength: [6,'비밀번호는 최소 6자리 이상입니다'],
    },
});

export default mongoose.model('user', userSchema);