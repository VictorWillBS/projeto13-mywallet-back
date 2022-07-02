import joi from "joi"

export const transSchema = joi.object({
    id : joi.string().required(),
    name: joi.string().required(),
    value:joi.number().required(),
    description: joi.string().required(),
    type: joi.alternatives().allow("entrada", "saida").required(),
    date: joi.date().required()
})