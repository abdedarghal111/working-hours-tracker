import { Component, createSignal, Show, onMount } from 'solid-js'
import { Container, Card, Button, Spinner } from 'solid-bootstrap'
import { FontAwesomeIcon } from 'solid-fontawesome'
import Timer from './components/Timer'
import History from './components/History'
import './App.css'

const App: Component = () => {
  const [isHistoryOpen, setIsHistoryOpen] = createSignal(false)
  const [isBackendReady, setIsBackendReady] = createSignal(false)

  onMount(() => {
    // Listen for the backend to finish its initialization
    window.api.onAppReady(() => {
      setIsBackendReady(true)
    })
    // Signal to the backend that the frontend is loaded and listening
    window.api.frontendReady()
  })

  const closeHistory = (): boolean => setIsHistoryOpen(false)

  return (
    <div class="app-container">
      <Button
        variant="light"
        class={`history-toggle-btn shadow ${isHistoryOpen() ? 'open' : ''}`}
        onClick={() => setIsHistoryOpen(!isHistoryOpen())}
      >
        <FontAwesomeIcon icon={'chevron-right'} />
      </Button>

      <div class={`history-backdrop ${isHistoryOpen() ? 'show' : ''}`} onClick={closeHistory} />

      <div class={`history-panel shadow-lg ${isHistoryOpen() ? 'open' : ''}`}>
        <History isOpen={isHistoryOpen()} />
      </div>

      <div class="main-content">
        <Container class="d-flex justify-content-center align-items-center vh-100">
          <Card class="shadow-sm text-center" style={{ width: '30rem' }}>
            <Card.Body>
              <Show
                when={isBackendReady()}
                fallback={
                  <div class="py-5">
                    <Spinner animation="border" role="status" variant="primary">
                      <span class="visually-hidden">Loading...</span>
                    </Spinner>
                    <p class="mt-3 text-muted">Iniciando backend...</p>
                  </div>
                }
              >
                <Timer />
              </Show>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <Button
        variant="secondary"
        class="devtools-toggle-btn shadow"
        onClick={() => window.api.toggleDevTools()}
      >
        <FontAwesomeIcon icon={'gear'} />
      </Button>
    </div>
  )
}

export default App
