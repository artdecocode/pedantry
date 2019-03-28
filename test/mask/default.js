import makeTestSuite from '@zoroaster/mask'
import { deepEqual } from 'zoroaster/assert'
import { collect } from 'catchment'
import Pedantry from '../../src'

export default makeTestSuite('test/result/default', {
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
  splitRe: /^\/\/ /gm,
  jsonProps: ['files'],
})

export const options = makeTestSuite('test/result/options', {
  async getResults(input) {
    const pedantry = new Pedantry(input, this.options)
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
  jsonProps: ['files', 'options'],
})