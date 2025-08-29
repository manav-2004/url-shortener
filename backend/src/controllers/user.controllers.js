import { ApiError } from '../utils/ApiError.js'
import { ApiResponse} from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { URI } from '../model.js/url.model.js'
import { nanoid } from 'nanoid'



const generate = asyncHandler( async (req, res)=>{

    const {uri} = req.body

    if (!uri){
        throw new ApiError(400, "Please Provide url")
    }

    // Ensure the URI starts with http:// or https://
    let validatedUri = uri;
    if (!/^https?:\/\//i.test(uri)) {
        validatedUri = `https://${uri}`;
    }

    // Normalize URI for comparison (ignore http/https)
    const normalizedUri = validatedUri.replace(/^https?:\/\//i, '');

    // Find all URLs that start with http or https
    const candidates = await URI.find({
        originalUrl: { $regex: `^https?://`, $options: 'i' }
    });

    // Compare normalized URLs in JS
    const existing = candidates.find(doc => doc.originalUrl.replace(/^https?:\/\//i, '') === normalizedUri);

    if (existing) {
        return res.status(200).json(
            new ApiResponse(200, { shortUrl: `${process.env.LOCAL_URL}/${existing.shortUrl}` }, "url already exists")
        );
    }

    const shortUrl = nanoid(9)

    await URI.create({
        shortUrl,
        originalUrl : validatedUri
    })

    res.status(201)
    .json(
        new ApiResponse(201, { shortUrl : `${process.env.LOCAL_URL}/${shortUrl}` }, "url created successfully")
    )

})

const redirect = asyncHandler( async (req, res)=>{


    const {shortUrl} = req.params

    if (!shortUrl){
        throw new ApiError(400,'url not sent')
    }

    const data = await URI.findOne({shortUrl})

    if (!data) {
        return res.status(404).send(`
            <html>
            <head><title>URL Not Found</title></head>
            <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h1>404 - Link Not Found</h1>
                <p>The short URL you tried does not exist.</p>
            </body>
            </html>
        `);
    }

    res.status(301)
    .redirect(data?.originalUrl)

})

export {
    generate,
    redirect
}


