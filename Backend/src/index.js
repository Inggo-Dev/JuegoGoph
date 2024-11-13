import app from './app';
import '@babel/polyfill';


async function main() {
  let port = 4004;
  await app.listen(port);
  console.log(`app on  port ${port}`);
}

main();