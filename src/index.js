import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app'
import { AppData } from './components/app_data'
import AddressBar from './handlers/address_bar'
import Collection from './handlers/collection'
import Guard from './handlers/guard'
import RNG from './handlers/rng'
import Storage from './handlers/storage'
import Twitter from './handlers/twitter'
import reportWebVitals from './reportWebVitals'

const twitter = Twitter()
const guard = Guard(twitter)
const addressBar = AddressBar(guard)
const storage = Storage(addressBar)
const rng = RNG(storage)
const collection = Collection(rng)
const app = (
  <React.StrictMode>
    <AppData handler={collection}>
      <App />
    </AppData>
  </React.StrictMode>
)

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(app)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
