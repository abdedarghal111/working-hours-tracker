import type { Component } from 'solid-js'
import { Alert, Button, Card, Container } from 'solid-bootstrap'
import Versions from '@components/Versions'
import electronLogo from '@assets/electron.svg'

const App: Component = () => {
  const handlePing = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Container class="py-5">
      <div class="d-flex flex-column gap-4">
        <Card class="shadow-sm">
          <Card.Body class="d-flex flex-column flex-md-row align-items-center gap-4">
            <img alt="Electron logo" class="logo" src={electronLogo} />
            <div class="text-md-start text-center">
              <Card.Title class="mb-3 fs-3">
                Build an Electron app with Solid y TypeScript
              </Card.Title>
              <Card.Text class="text-muted">
                Empieza rapido con electron-vite, SolidJS y los componentes de solid-bootstrap.
              </Card.Text>
              <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center justify-content-md-start mt-3">
                <Button
                  as="a"
                  href="https://electron-vite.org/"
                  target="_blank"
                  rel="noreferrer"
                  variant="outline-secondary"
                >
                  Documentacion
                </Button>
                <Button onClick={handlePing} variant="primary">
                  Enviar IPC
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card class="shadow-sm">
          <Card.Body>
            <Card.Title class="fs-4 mb-3">Herramientas para desarrolladores</Card.Title>
            <Alert variant="info" class="mb-0">
              Pulsa <code>F12</code> para abrir las DevTools y depurar tu aplicacion de escritorio.
            </Alert>
          </Card.Body>
        </Card>

        <Card class="shadow-sm">
          <Card.Body class="text-center">
            <Card.Title class="fs-5 mb-3">Versiones en uso</Card.Title>
            <Card.Text class="text-muted">
              Consulta rapidamente que versiones de Electron, Chromium y Node alimentan la app.
            </Card.Text>
            <Versions />
          </Card.Body>
        </Card>
      </div>
    </Container>
  )
}

export default App
