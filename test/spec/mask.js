import { makeTestSuite } from 'zoroaster'
import { collect } from 'catchment'
import Pedantry from '../../src'

const ts = makeTestSuite('test/mask', {
  async getResults(input) {
    const pedantry = new Pedantry(input)
    const res = await collect(pedantry)
    return res
  },
})

export default ts