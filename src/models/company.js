import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
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

const companySchema = new mongoose.Schema( {
    name: { type: String, required: true, unique: true },
    recruiting: { type: Number },
    companyInform: { type: String },
    companyType: { type: String },
    companyDate: { type: String },
});

const companyData = mongoose.model('company_data', companySchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../../src/crawling/company.csv');

if (!fs.existsSync(filePath)) {
    console.error('CSV 파일이 존재하지 않습니다:', filePath);
    process.exit(1);
}

const companys = [];

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        companys.push(row);
    })
    .on('end', async () => {
        try {
            await companyData.insertMany(companys, {ordered: false});
            console.log('모든 데이터 저장.');
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

export default mongoose.model('company', companySchema);