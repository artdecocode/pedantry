import { makeTestSuite } from 'zoroaster'
import { collect } from 'catchment'
import Pedantry from '../../src'

const ts = makeTestSuite('test/mask', {
  async getResults(input) {
    const [path, options] = input.split('\n')
    const opts = options ? JSON.parse(options) : {}
    const pedantry = new Pedantry(path, opts)
    const res = await collect(pedantry)
    return res
  },
})

export default ts