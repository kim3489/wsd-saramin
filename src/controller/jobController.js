import mongoose from 'mongoose';
import { mongodb } from '../config/mongodb.js';
import JobData from '../models/job.js';

export const getJobs = async (req, res) => {
    try {
        await mongodb();

        const { search, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc', location, experience, field } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const filter = {};
        if (search) filter.title = { $regex: search, $options: 'i' };
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (experience) filter.experience = { $regex: experience, $options: 'i' };
        if (field) filter.fields = { $regex: field, $options: 'i' };

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const jobs = await JobData.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await JobData.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "채용 공고 조회 성공",
            data:{
                total: total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
                jobs: jobs,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "채용 공고 조회 오류",
            error: error.message,
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        await mongodb();

        const { id } = req.params;

        const deletedJob = await JobData.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({
                success: false,
                message: '채용공고를 찾을 수 없음' });
        }

        res.status(200).json({
            success: true,
            message: '공고 삭제 성공'
        });
    } catch(err) {
        console.error("공고 삭제 오류 : ", err);
        throw err;
    }
};


export const updateJob = async (req, res) => {
    try {
        await mongodb();

        const jobData = req.body.data;
        const { id } = req.body;
        const newData = jobData;

        const objectId = new mongoose.Types.ObjectId(id);
        const updatedData = await JobData.findOneAndUpdate(
            { _id: objectId  },
            { $set: newData },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: '데이터 수정 성공',
            data: {
                jobData: updatedData,
            }
        });
    } catch (err) {
        console.error('데이터 수정 오류: ', err);
        res.status(500).json({
            success: false,
            message: '서버 오류',
        });
    }
};

export const createJob = async (req, res) => {
    try {
        await mongodb();

        const newJobData = req.body;
        console.log(newJobData);

        const checkJobData = await JobData.findOne({title: newJobData.title});

        if(checkJobData) {
            return res.status(403).json({
                success: false,
                message: '공고 이미 존재'
            });
        };

        await JobData.create(newJobData);

        res.status(200).json({
            success: true,
            message: '공고 등록 성공',
            data: {
                jobData: newJobData
            }
        });
    } catch(err) {
        console.error("공고 등록 중 오류 발생 : ", err);
        throw err;
    }
};

