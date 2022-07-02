
export function validateSchema(schema,toValid){
    const {error}= schema.validate(toValid)
    return error
    
}