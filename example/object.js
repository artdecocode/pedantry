import Pedantry from '../src'
import { Transform } from 'stream'

const pedantry = new Pedantry('example/simple-test', {
  includeFilename: true,
  addBlankLine: true,
})
const t = new Transform({
  objectMode: true,
  transform(object, _, next) {
    console.log(object)
    next()
  },
})
pedantry.pipe(t)