import Joi = require("joi")

export const bodyRequest = {
    createPertemuan: Joi.object({
        kelas: Joi.string().required(),
        makul: Joi.string().required(),
        pertemuan: Joi.string().required()
    }),
    editQuizLabelPertemuan: Joi.object({
        oldLabel: Joi.string().required(),
        newLabel: Joi.string().required()
    }),
    deleteQuizPertemuan: Joi.object({
        label: Joi.string().required()
    }),
    addQuizPertemuan: Joi.object({
        label: Joi.string().required()
    }),
    createPoint: Joi.object({
        nim: Joi.string().required(),
    }),
    editPoint: Joi.object({
        poin: Joi.string().required(),
    }),
}