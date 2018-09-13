import Pedantry from '../src'

const pedantry = new Pedantry('example/simple-test', {
  reverse: true,
})
pedantry.pipe(process.stdout)