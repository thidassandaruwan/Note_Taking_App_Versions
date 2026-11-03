import path from "node:path"
import fs from "node:fs/promises"
import { sendResponse } from "./sendResponse.js";

export async function serveStatic(req, res, baseDIR){
    // get the resource file path
    const publicDIR = path.join(baseDIR, "public");
    const resourcPath = path.join(publicDIR, 
        req.url === "/" ? "index.html" : req.url
    )
    // get the content type
    const contentType = getContentType(path.extname(resourcPath));
    
    // try read the file and send the content
    try{
        const content = await fs.readFile(resourcPath);
        sendResponse(res, 200, contentType, content);

    }
    catch(error){
        if (error.code === "ENOENT"){
            return sendResponse(
                res, 
                404, 
                'text/html', 
                '<html><h1>Reqested file does not exist!.</h1></html>'
            );
        }

        console.log(error.message)
        sendResponse(
        res, 
        500, 
        'text/html', 
        '<html><h1>Somethign went wrong when returning data.</h1></html>'
        );
    }
}

function getContentType(ext) {
   
   const types = {
     ".js": "text/javascript",
     ".css": "text/css",
     ".json": "application/json",
     ".png": "image/png",
     ".jpg": "image/jpeg",
     ".jpeg": "image/jpeg",
     ".gif": "image/gif",
     ".svg": "image/svg+xml"
   }


  return types[ext.toLowerCase()] || 'text/html'; 
  // if the content type is not definined browsers have a better chance of reading them properly if we send them with content type as text/html
}