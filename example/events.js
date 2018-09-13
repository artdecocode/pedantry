import Pedantry from '../src'

const pedantry = new Pedantry('example/simple-test')
pedantry.on('file', f => console.log(f))