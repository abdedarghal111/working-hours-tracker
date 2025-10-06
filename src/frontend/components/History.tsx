import { Component, createSignal, For, createEffect } from 'solid-js'
import { Card, ListGroup } from 'solid-bootstrap'
import { FontAwesomeIcon } from 'solid-fontawesome'

interface SessionData {
  session: {
    id: number
    start_time: string
    end_time: string
  }
  pauses: {
    pause_time: string
    resume_time: string | null
  }[]
}

interface HistoryProps {
  isOpen: boolean
}

const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (durationSeconds: number): string => {
  if (durationSeconds < 0) durationSeconds = 0
  const hours = Math.floor(durationSeconds / 3600)
  const minutes = Math.floor((durationSeconds % 3600) / 60)
  const seconds = Math.floor(durationSeconds % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`
}

const History: Component<HistoryProps> = (props) => {
  const [history, setHistory] = createSignal<SessionData[]>([])

  createEffect(() => {
    if (props.isOpen) {
      window.api.getHistory().then((historyData) => setHistory(historyData))
    }
  })

  const calculateDuration = (item: SessionData): number => {
    const startTime = new Date(item.session.start_time).getTime()
    const endTime = new Date(item.session.end_time).getTime()
    let totalPausedTime = 0

    item.pauses.forEach((p) => {
      if (p.resume_time) {
        totalPausedTime += new Date(p.resume_time).getTime() - new Date(p.pause_time).getTime()
      }
    })

    return (endTime - startTime - totalPausedTime) / 1000
  }

  return (
    <div class="p-3" style={{ 'max-height': '100vh', 'overflow-y': 'auto' }}>
      <h2 class="text-center mb-4 fw-light">Historial</h2>
      <For
        each={history()}
        fallback={<p class="text-center text-muted mt-5">No hay sesiones completadas.</p>}
      >
        {(item) => (
          <Card class="mb-3 shadow-sm">
            <Card.Header class="fw-bold">Sesión #{item.session.id}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item class="d-flex justify-content-between align-items-center">
                <span>
                  <span class="me-1 text-success">
                    <FontAwesomeIcon icon="calendar-days" />
                  </span>
                  Inicio
                </span>
                <span class="text-muted small">{formatDateTime(item.session.start_time)}</span>
              </ListGroup.Item>
              <ListGroup.Item class="d-flex justify-content-between align-items-center">
                <span>
                  <span class="me-1 text-danger">
                    <FontAwesomeIcon icon="calendar-days" />
                  </span>
                  Fin
                </span>
                <span class="text-muted small">{formatDateTime(item.session.end_time)}</span>
              </ListGroup.Item>
              <ListGroup.Item class="d-flex flex-column text-center py-3">
                <span class="text-uppercase small text-muted">
                  <span class="me-1">
                    <FontAwesomeIcon icon="clock" />
                  </span>
                  Duración Trabajada
                </span>
                <span class="display-6 fw-bold">{formatDuration(calculateDuration(item))}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        )}
      </For>
    </div>
  )
}

export default History
