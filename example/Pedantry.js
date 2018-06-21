import Catchment from 'catchment'
import Pedantry from '../src'

(async () => {
  try {
    const pedantry = new Pedantry('example/test')
    const catchment = new Catchment()
    pedantry.pipe(catchment)
    const res = await catchment.promise
    console.log(res)
  } catch ({ stack }) {
    console.log('stack')
  }
})()
