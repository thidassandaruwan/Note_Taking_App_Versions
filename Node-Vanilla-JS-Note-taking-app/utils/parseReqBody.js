export async function parseReqBody(req) {
    let reqBody = "";
    for await(const chunk of req){
        reqBody += chunk;
    }

    // json parse raise "syntax error" if string is not object format
    const body = JSON.parse(reqBody);

    if (!body.title?.trim() || !body.body?.trim()){
        const error  = new Error("Invalid data format");
        error.name = "ValidationError";
        throw error;
    }

    return body;
}