import { type Component } from 'solid-js'
import { Badge } from 'solid-bootstrap'

const Versions: Component = () => {
  const versions = window.electron.process.versions

  return (
    <div class="d-flex flex-wrap justify-content-center gap-2">
      <Badge bg="dark">Electron v{versions.electron}</Badge>
      <Badge bg="dark">Chromium v{versions.chrome}</Badge>
      <Badge bg="dark">Node v{versions.node}</Badge>
    </div>
  )
}

export default Versions
