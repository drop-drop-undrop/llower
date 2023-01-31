import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app'
import PageAddress from './handlers/page_address'
import Coordinator from './handlers/coordinator'
import RNG from './handlers/rng'
import Storage from './handlers/storage'
import Twitter from './handlers/twitter'
import reportWebVitals from './reportWebVitals'

const pipe = (stages = []) => {
  const prefix = (a, b) => () => b(a())
  const build = stages.reduceRight(prefix)
  return build()
}
const handler = pipe([
  Coordinator,
  RNG,
  Storage,
  PageAddress,
  Twitter,
])
const app = (
  <React.StrictMode>
    <App handler={handler} />
  </React.StrictMode>
)

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(app)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
