import { render } from 'solid-js/web'
import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@assets/main.css'

render(() => <App />, document.getElementById('root') as HTMLElement)
