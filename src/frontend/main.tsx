/* @refresh reload */
import { render } from 'solid-js/web'
import 'bootstrap/dist/css/bootstrap.min.css'
import './icons'
import App from './App'

// --- Backend Log Listener ---
window.api.onLog((level, ...args) => {
  const styles = {
    log: 'color: #aaa;',
    error: 'color: #f88;',
    warn: 'color: #ff0;',
    info: 'color: #88f;'
  }
  console[level](`%c[BACKEND]`, styles[level], ...args)
})

render(() => <App />, document.getElementById('root') as HTMLElement)
