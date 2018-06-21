import { equal } from 'zoroaster/assert'
import Context from '../context'
import Pedantry from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof Pedantry, 'function')
  },
  async 'calls package without error'({ source, content, catchment: { promise, stream } }) {
    const pedantry = new Pedantry(source, content)
    pedantry.pipe(stream)
    const res = await promise
    console.log(res)
  },
  // async 'calls test context method'({ example }) {
  //   await example()
  // },
}

export default T
