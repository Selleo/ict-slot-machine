import Api from '../src/api.js'

console.log(process.env.URL, process.env.USER, process.env.PASSWORD)

await Api.getUser(5501579525414).then((result) => console.log(result));
await Api.getUser(5501579525414).then((result) => console.log(result));
await Api.getUser(5501579525414).then((result) => console.log(result));
