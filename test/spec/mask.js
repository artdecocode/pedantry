import { makeTestSuite } from 'zoroaster'
import { deepEqual } from 'zoroaster/assert'
import { collect } from 'catchment'
import Pedantry from '../../src'

const ts = makeTestSuite('test/mask', {
  async getResults(input) {
    const [path, options] = input.split('\n')
    const opts = options ? JSON.parse(options) : {}
    const pedantry = new Pedantry(path, opts)
    const files = []
    pedantry.on('file', f => files.push(f))
    const res = await collect(pedantry)
    return { res, files }
  },
  mapActual({ res }) {
    return res
  },
  assertResults({ files: actual }, { files }) {
    if (files) {
      deepEqual(actual, files)
    }
  },
  jsonProps: ['files'],
})

export default ts