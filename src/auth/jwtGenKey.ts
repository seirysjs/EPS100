const generateStringRandom = (() => Math.round(Math.random() * 100000000000).toString(24).substring(1))();
const generateHexRandom = (() => Math.round(Math.random() * 1000000000).toString(16).substring(1))();
const generateMathRandom = (() => Math.round(Math.random() * 10000))();
const substringTime = (() => (new Date()).getTime().toString(16).substring(7))();
const jwtSecretKeyGen = (() => `4${generateHexRandom}S${generateStringRandom}E${generateMathRandom}C${substringTime}R${generateMathRandom}E${generateStringRandom}T${generateStringRandom}Key${generateHexRandom}2`)();

const envNodeJs = process.env.NODE_ENV; // Gen switches to static in !=prod ENV

const jwtSecretKey = { runtimeSecretKey: (envNodeJs == "production") ? jwtSecretKeyGen : "devMode"};
export const jwtSecret = jwtSecretKey.runtimeSecretKey;