const WorkModel = require('./../models/work.Model');


const workController = {
    getAllWorks: (req, res) => {
        // const { userId } = req.query;
        WorkModel.find({ userId: req.user._id })
            .then(works => {
                return res.status(201).json({
                    error: 0,
                    message: 'Get all successfully',
                    payload: works
                });
            })
            .catch(err => {
                return res.status(500).json({
                    error: 3,
                    message: 'Server Error',
                    payload: {}
                })
            })
    },
    addWork: async (req, res) => {
        const { workName, workStatus } = req.body;
        const newWork = new WorkModel({
            workName: workName,
            workStatus: workStatus,
            userId: req.user._id
        })
        newWork.save((err, doc) => {
            if (err) {
                return res.status(500).json({
                    error: 3,
                    message: 'Server Error',
                    payload: doc
                })
            }
            return res.status(201).json({
                error: 0,
                message: 'work added',
                payload: {}
            })
        })
    },
    editWork: async (req, res) => {
        try {
            const { workId, workName, workStatus } = req.body;
            const result = await WorkModel.updateOne({ _id: workId }, { $set: { workName: workName, workStatus: workStatus } });
            res.status(200).json({
                error: 0,
                message: 'update work successfully',
                payload: {}
            })
        } catch (error) {
            return res.status(500).json({
                error: 3,
                message: 'Server Error',
                payload: {}
            })
        }
    },
    deleteWork: async (req, res) => {
        try {
            const _id = req.body._id;
            await WorkModel.deleteOne({ _id: _id });
            return res.status(200).json({
                error: 0,
                message: 'delete work successfully',
                payload: {}
            });
        } catch (error) {
            return res.status(500).json({
                error: 3,
                message: 'Server Error',
                payload: {}
            })
        }
    },
    findWork: async (req, res) => {
        try {
            const { key } = req.body;
            const result = await WorkModel.find({ userId: req.user._id, workName: { $regex: key, $options: 'i' } });
            return res.status(200).json({
                error: 0,
                message: 'search successfully',
                payload: result
            })
        } catch (error) {
            return res.status(500).json({
                error: 3,
                message: 'Server Error',
                payload: {}
            })
        }
    }
}

module.exports = workController;