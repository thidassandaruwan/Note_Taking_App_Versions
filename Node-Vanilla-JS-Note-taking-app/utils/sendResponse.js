export async function sendResponse(res, statusCode, contentType, content){
    // overriding cors policy
    res.setHeader("Access-Control-Allow-Origin", "*")  // allowing requests from any domain, any port, any protocol
    res.setHeader('Content-Type', contentType)
    res.statusCode = statusCode
    res.end(content);
}