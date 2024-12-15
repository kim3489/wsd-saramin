import mongoose from 'mongoose';

export const  mongodb = async () => {
    try {
        const mongoURI = 'mongodb://localhost:27017';
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoURI);

        const db = mongoose.connection;
        console.log("연결 성공");

        db.on('error', console.error.bind(console, '연결 실패 : '));
        db.once('open', () => {
            console.log('연결 성공');
        });
    } catch(err){
        console.error("database 접속 error : ", err);
        throw err;
    }
};

export default mongodb;