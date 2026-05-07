import { createClient } from "redis";
const client = createClient();
async function processSubmission(submission) {
    const { code, language, prblmId } = JSON.parse(submission);
    console.log(`processing submission for problemId: ${prblmId}`);
    console.log(`Code: ${code}`);
    console.log(`language : ${language}`);
    //Simulate code processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId: ${prblmId}`);
    console.log(`Processed code for problemId: ${prblmId}`);
}
async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to REDIS");
        while (true) {
            try {
                // we did brpop here so that it waits here for a response from the queue
                // or else it ll keep on running and consuming cpu cycles unnecessarily
                // and also keep becoming null when there is no data in the queue
                const submission = await client.brPop("problems", 0);
                // @ts-ignore
                await processSubmission(submission.element);
            }
            catch (err) {
                console.error("Error processing the request: ", err);
                // Implement your error handling logic here. For example, you might want to push
                // the submission back onto the queue or log the error to a file.
            }
        }
    }
    catch (err) {
        console.error("Failed to connect to Redis", err);
    }
}
startWorker();
//# sourceMappingURL=index.js.map