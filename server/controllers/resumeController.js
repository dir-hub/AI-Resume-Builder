

//controller for creating a new resumes

import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

//POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        //create new resume
        const newResume = await Resume.create({
            userId,
            title,
        });
        return res.status(201).json({ message: "Resume created successfully", resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for deleting resumes
//DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        // diagnostic logging to help debug 404s
        console.log('[DELETE] request received for resumes. params:', req.params, 'body:', req.body);
        console.log('[DELETE] authorization header:', req.headers.authorization ? 'present' : 'missing');
        // accept resumeId from URL param or request body
        const resumeId = req.params?.resumeId || req.body?.resumeId;
        if (!resumeId) {
            return res.status(400).json({ message: "Missing resumeId" });
        }

        await Resume.findOneAndDelete({ _id: resumeId, userId });

        return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//get resume user by id
//GET: /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        // accept resumeId from URL param or request body
        const resumeId = req.params?.resumeId || req.body?.resumeId;
        if (!resumeId) {
            return res.status(400).json({ message: "Missing resumeId" });
        }

        const resume = await Resume.findOne({ _id: resumeId, userId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//get resume by id public
//GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            _id: resumeId,
            public: true,
        });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for updating resume
//PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = await JSON.parse(resumeData);
        }else {
            resumeDataCopy = structuredClone(resumeData);
        }
        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation:{
                    pre:'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });

            resumeDataCopy.personal_info.image = response.url;
        }
        const resume = await Resume.findOneAndUpdate(
            {
                _id: resumeId,
                userId,
            },
            resumeDataCopy, { new: true })

        return res.status(200).json({ message: "Resume updated successfully", resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}