import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

library.add(faHouse, faPlay, faPause, faStop)
