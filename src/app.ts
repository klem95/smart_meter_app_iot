import express from "express";

(async () => {
    // Make sure database is up to date
    const app : express.Application = express()
    const port = process.env.PORT || 3000
    app.listen(port, (): void => {
        console.log('Server is running at port ' + port)
        if (process.env.PORT == null) {
            console.log('The port was not given through an enviroment variable - falling back to 3000')
        }
    })
})()
