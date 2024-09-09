const protocol = "http";
const hostname1 = "172.20";
const hostname2 = "1.38";
const port = "8080";
const path = "/CustomerFeedback/";
const localPath = `http://localhost:${window.location.port}/CustomerFeedback/`;
const corpLink = 'https://corpapps.rabbitandtortoise.com/CustomerFeedback/';
const UatEmail = 'uatapps@rabbitandtortoise.com';
const CorpEmail = 'rntapps@rabbitandtortoise.com';

// Determine the environment and set the URL and email accordingly
let CommonUrl;
let commonEmail;
let CommonEmailUrl;

if (window.location.hostname === 'localhost') {
    CommonUrl = localPath;
    commonEmail = UatEmail;
    CommonEmailUrl = `${protocol}://${hostname1}.${hostname2}:${port}${path}`
} else if (window.location.hostname === `${hostname1}.${hostname2}`) {
    CommonUrl = `${protocol}://${hostname1}.${hostname2}:${port}${path}`;
    commonEmail = UatEmail;
    CommonEmailUrl = `${protocol}://${hostname1}.${hostname2}:${port}${path}`
} else if (window.location.hostname.includes('corpapps.rabbitandtortoise.com')) {
    CommonUrl = corpLink;
    commonEmail = CorpEmail;
    CommonEmailUrl = corpLink
} else {
    // Default or fallback values (if any)
    CommonUrl = localPath; // or set to any other default URL
    commonEmail = UatEmail; // or any other default email
}

export { CommonUrl, commonEmail, CommonEmailUrl };
