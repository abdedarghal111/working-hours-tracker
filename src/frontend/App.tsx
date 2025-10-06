import { Component } from 'solid-js'
import { Container, Card } from 'solid-bootstrap'
import Timer from './components/Timer'

const App: Component = () => {
  return (
    <Container class="d-flex justify-content-center align-items-center vh-100">
      <Card class="shadow-sm text-center" style={{ width: '30rem' }}>
        <Card.Body>
          <Timer />
        </Card.Body>
      </Card>
    </Container>
  )
}

export default App
