import express from 'express'
import { getJobs, deleteJob, updateJob, createJob } from '../controller/jobController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 API
 */


/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 채용 공고 조회
 *     description: 채용 공고 목록을 조회합니다.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: "갱신날짜"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "desc"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: "전주"
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *           example: "신입"
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *           example: "소프트웨어 개발"
 *     responses:
 *       200:
 *         description: 성공적으로 공고 목록을 조회했습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.get('/', getJobs);


/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: 채용 공고 삭제
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: 성공적으로 공고를 삭제했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "공고 삭제 성공"
 *       403:
 *         description: 삭제하려는 공고를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.delete('/:id', deleteJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: 채용 공고 수정
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 공고 제목
 *                 example: "백엔드 개발자 모집 (수정)"
 *     responses:
 *       200:
 *         description: 성공적으로 공고 데이터를 업데이트했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "데이터 수정 성공"
 *       400:
 *         description: 유효하지 않은 요청입니다.
 *       404:
 *         description: 공고 제목을 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.put('/:id', updateJob);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: 채용 공고 추가
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 공고 제목
 *                 example: "백엔드 개발자 모집"
 *               company_name:
 *                 type: string
 *                 description: 회사 이름
 *                 example: "현대모비스"
 *               employment_type:
 *                 type: string
 *                 description: "고용 형태"
 *                 example: "정규직"
 *     responses:
 *       201:
 *         description: 성공적으로 공고를 추가했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "공고 등록 성공"
 *       400:
 *         description: 채용 공고 등록 실패
 *       403:
 *         description: 중복된 공고가 존재합니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.post('/', createJob);


export  default router;