import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        // checking if the user has rate limited
        const {success} = await ratelimit.limit("my-rate-limit");
        // ratelimit.limit() returns a json with {success : true/false, limit : (int)request limit, remaining : (int)requests left, reset: when the limit resets in miliseonnds}
    
        // const {success} pulls the "success" value from that return json 

        // ^ from above limit("my-rate-limit");  limit() expects a user id to get the user rate limit data
        // in a real world scenario this value would be a dynamic value for each user, 
        // like each user of the app has an id and we include that user.id instead of a hardcoded string
        // but because we are using a hardcoded string here, each req is sent from one user. so....


        // if success value is false, it means the user is rate limited
        if (!success)
        {
            return res.status(429).json({message : "Too many requests, try again later! "});
        }

        next();
    } 
    catch (error) {
        console.log("Rate Limit Error ", error);
        next(error);
    }
}   


export default rateLimiter;