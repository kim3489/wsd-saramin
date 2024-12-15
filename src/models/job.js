import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath }from'url';
import { mongodb } from '../config/mongodb.js';

const start = async ()=> {
    try{
        await mongodb();
        console.log("연걸 성공");
    }catch(err){
        console.error("연결 오류 : ", err);
        throw err;
    }
};

start();

const jobDataSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, primaryKey: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    location: { type: String },
    experience: { type: String },
    education: { type: String },
    employmentType: { type: String },
    deadline: { type: String },
    sector: { type: String },
    createdAt: { type: String}
});

const jobData = mongoose.model('job_data', jobDataSchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../../src/crawling/jobEdit.csv');

if (!fs.existsSync(filePath)) {
    console.error('CSV 파일이 존재하지 않습니다:', filePath);
    process.exit(1);
}

const jobs = [];

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        jobs.push(row);  // 일괄 저장을 위해 배열에 추가
    })
    .on('end', async () => {
        try {
            await jobData.insertMany(jobs, {ordered: false});
            console.log('모든 데이터 저장');
        } catch (error) {
            if (error.code === 11000) {
                console.log(`중복된 데이터 무시되고 저장`);
            } else {
                console.error(`에러 발생: ${error}`);
            }
        } finally {
            mongoose.disconnect().then(() => {
                console.log('mongoDB 연결 종료');
            });
        }
    })
    .on('error', (error) => {
        console.error('CSV 파일 처리 중 에러 발생:', error);
        mongoose.disconnect();
    });

export default mongoose.model('JobData', jobDataSchema,'job_data');