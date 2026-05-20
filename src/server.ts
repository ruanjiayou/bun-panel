import app from './app';

process.on('uncaughtException', err => {
  console.log(err)
})
process.on('unhandledRejection', err => {
  console.log(err)
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});
