import 'module-alias/register'
import { start } from './start'
import * as path from 'path'
const Parcel = require('parcel-bundler')

const entry = path.resolve(__dirname, '..', '..', 'index.html')

start()

new Parcel(entry, {
  cacheDir: '.cache',
  autoInstall: false,
  hmr: true,
  watch: true,
  target: 'browser',
}).serve()
