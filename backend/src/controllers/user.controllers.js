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

    const shortUrl = nanoid(9)

    await URI.create({
        shortUrl,
        originalUrl : uri
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


