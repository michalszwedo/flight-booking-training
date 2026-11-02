import { useState } from 'react'
import { flights } from './data/flights.js'
import './App.css'

const airportNames = {
  BLR: 'Bengaluru',
  DEL: 'New Delhi',
  BOM: 'Mumbai',
}

const initialSearch = {
  origin: 'BLR',
  destination: 'DEL',
  date: '2026-11-20',
}

const formatInr = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

function App() {
  const [search, setSearch] = useState(initialSearch)
  const [activeSearch, setActiveSearch] = useState(initialSearch)
  const [searchError, setSearchError] = useState('')
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [passengerName, setPassengerName] = useState('Test Traveller')
  const [passengerCount, setPassengerCount] = useState('1')
  const [bookingError, setBookingError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const results = activeSearch
    ? flights.filter(
        (flight) =>
          flight.origin === activeSearch.origin &&
          flight.destination === activeSearch.destination &&
          flight.date === activeSearch.date,
      )
    : []

  const count = Number(passengerCount)
  const total =
    selectedFlight && Number.isInteger(count) && count >= 1 && count <= 6
      ? selectedFlight.priceInr * count
      : null

  const updateSearch = (field, value) => {
    setSearch((currentSearch) => ({ ...currentSearch, [field]: value }))
    setActiveSearch(null)
    setSelectedFlight(null)
    setConfirmation(null)
    setSearchError('')
    setBookingError('')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const normalizedSearch = {
      origin: search.origin.trim().toUpperCase(),
      destination: search.destination.trim().toUpperCase(),
      date: search.date,
    }

    setSelectedFlight(null)
    setConfirmation(null)
    setBookingError('')

    if (!normalizedSearch.origin || !normalizedSearch.destination || !normalizedSearch.date) {
      setActiveSearch(null)
      setSearchError('Choose both airports and a travel date to search.')
      return
    }

    if (normalizedSearch.origin === normalizedSearch.destination) {
      setActiveSearch(null)
      setSearchError('Origin and destination must be different airports.')
      return
    }

    setSearch(normalizedSearch)
    setActiveSearch(normalizedSearch)
    setSearchError('')
  }

  const handleBooking = (event) => {
    event.preventDefault()
    const trimmedName = passengerName.trim()
    const parsedCount = Number(passengerCount)

    if (!trimmedName) {
      setBookingError('Enter the sample passenger name to continue.')
      return
    }

    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 6) {
      setBookingError('Passenger count must be a whole number from 1 to 6.')
      return
    }

    if (!selectedFlight) {
      setBookingError('Select a flight before continuing.')
      return
    }

    setConfirmation({
      reference: `TRAIN-${Date.now().toString(36).toUpperCase()}`,
      status: 'SIMULATED',
      name: trimmedName,
      passengers: parsedCount,
      flight: selectedFlight,
      totalInr: selectedFlight.priceInr * parsedCount,
    })
    setBookingError('')
  }

  const selectFlight = (flight) => {
    setSelectedFlight(flight)
    setConfirmation(null)
    setBookingError('')
  }

  return (
    <div className="app-shell">
      <div className="training-banner">
        <span className="status-dot" aria-hidden="true" />
        TRAINING ONLY <span className="banner-divider">/</span> simulated booking, no ticket issued
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Training Flights home">
          <span className="brand-mark" aria-hidden="true">TF</span>
          <span className="brand-name">Training Flights</span>
        </a>
        <span className="header-note">A local booking demo</span>
      </header>

      <main className="page-shell" id="top">
        <section className="page-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">INDIA · DOMESTIC ROUTES</p>
            <h1 id="page-title">Make room for <em>takeoff.</em></h1>
            <p className="intro-copy">Choose a route, compare the fare, and try a simulated booking.</p>
          </div>
          <div className="demo-stamp" aria-label="Demo date November 2026">
            <span>DEMO DATE</span>
            <strong>NOV ’26</strong>
          </div>
        </section>

        <section className="search-panel" aria-labelledby="search-title">
          <div className="panel-heading">
            <div className="step-number">01</div>
            <div>
              <p className="eyebrow">START WITH A ROUTE</p>
              <h2 id="search-title">Where are you headed?</h2>
            </div>
          </div>

          <form className="search-form" onSubmit={handleSearch} noValidate>
            <label className="field-group" htmlFor="origin">
              <span>From</span>
              <select
                id="origin"
                value={search.origin}
                onChange={(event) => updateSearch('origin', event.target.value)}
              >
                <option value="">Choose airport</option>
                {Object.entries(airportNames).map(([code, name]) => (
                  <option key={code} value={code}>{name} ({code})</option>
                ))}
              </select>
            </label>
            <label className="field-group" htmlFor="destination">
              <span>To</span>
              <select
                id="destination"
                value={search.destination}
                onChange={(event) => updateSearch('destination', event.target.value)}
              >
                <option value="">Choose airport</option>
                {Object.entries(airportNames).map(([code, name]) => (
                  <option key={code} value={code}>{name} ({code})</option>
                ))}
              </select>
            </label>
            <label className="field-group date-field" htmlFor="travel-date">
              <span>Travel date</span>
              <input
                id="travel-date"
                type="date"
                value={search.date}
                onChange={(event) => updateSearch('date', event.target.value)}
              />
            </label>
            <button className="search-button" type="submit">
              Search flights <span aria-hidden="true">→</span>
            </button>
          </form>
          {searchError && <p className="form-error" role="alert">{searchError}</p>}
        </section>

        <div className="booking-layout">
          <section className="results-section" aria-labelledby="results-title">
            <div className="results-heading">
              <div>
                <p className="eyebrow">02 · AVAILABLE FLIGHTS</p>
                <h2 id="results-title">Pick your departure</h2>
              </div>
              {activeSearch && (
                <span className="result-count">{results.length} {results.length === 1 ? 'flight' : 'flights'}</span>
              )}
            </div>

            {results.length > 0 ? (
              <div className="flight-list" aria-live="polite">
                {results.map((flight) => (
                  <button
                    className={`flight-option${selectedFlight?.id === flight.id ? ' is-selected' : ''}`}
                    key={flight.id}
                    type="button"
                    aria-pressed={selectedFlight?.id === flight.id}
                    onClick={() => selectFlight(flight)}
                  >
                    <span className="flight-number">
                      <strong>{flight.id}</strong>
                      <small>{flight.airline}</small>
                    </span>
                    <span className="flight-route">
                      <strong>{flight.departure}</strong>
                      <span>{airportNames[flight.origin]} <b>{flight.origin}</b></span>
                    </span>
                    <span className="route-line" aria-label="Nonstop">
                      <span />
                      <small>NONSTOP</small>
                    </span>
                    <span className="flight-route arrival-route">
                      <strong>{airportNames[flight.destination]}</strong>
                      <span>{flight.destination}</span>
                    </span>
                    <span className="fare-block">
                      <strong>{formatInr(flight.priceInr)}</strong>
                      <span>per person</span>
                    </span>
                    <span className="select-indicator" aria-hidden="true">
                      {selectedFlight?.id === flight.id ? '✓' : '＋'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state" role={searchError ? 'status' : undefined}>
                <span className="empty-mark" aria-hidden="true">↗</span>
                <h3>{activeSearch ? 'No flights on this route' : 'Search to see available flights'}</h3>
                <p>{activeSearch ? 'Try another airport pair or travel date.' : 'Choose two different airports and a date above.'}</p>
              </div>
            )}
          </section>

          <aside className="booking-panel" aria-labelledby="booking-title">
            <div className="booking-panel-heading">
              <p className="eyebrow">03 · YOUR TRIP</p>
              <h2 id="booking-title">{confirmation ? 'Booking preview' : 'Review & confirm'}</h2>
            </div>

            {confirmation ? (
              <div className="confirmation" aria-live="polite">
                <div className="confirmation-status">
                  <span className="confirmation-check" aria-hidden="true">✓</span>
                  <span>{confirmation.status}</span>
                </div>
                <p className="reference-label">DISPLAY REFERENCE</p>
                <p className="reference-value">{confirmation.reference}</p>
                <div className="confirmation-route">
                  <strong>{confirmation.flight.origin}</strong>
                  <span aria-hidden="true">→</span>
                  <strong>{confirmation.flight.destination}</strong>
                </div>
                <dl className="confirmation-details">
                  <div><dt>Traveller</dt><dd>{confirmation.name}</dd></div>
                  <div><dt>Date</dt><dd>{formatDate(confirmation.flight.date)}</dd></div>
                  <div><dt>Passengers</dt><dd>{confirmation.passengers}</dd></div>
                  <div><dt>Total</dt><dd>{formatInr(confirmation.totalInr)}</dd></div>
                </dl>
                <p className="confirmation-note">This is a demo only. No reservation was made.</p>
              </div>
            ) : selectedFlight ? (
              <form className="booking-form" onSubmit={handleBooking} noValidate>
                <div className="selected-route">
                  <div>
                    <span>{selectedFlight.id} · {selectedFlight.airline}</span>
                    <strong>{selectedFlight.origin} <b>→</b> {selectedFlight.destination}</strong>
                  </div>
                  <span>{selectedFlight.departure} IST</span>
                </div>
                <p className="selected-date">{formatDate(selectedFlight.date)}</p>

                <label className="field-group booking-name" htmlFor="passenger-name">
                  <span>Sample passenger name</span>
                  <input
                    id="passenger-name"
                    type="text"
                    autoComplete="off"
                    value={passengerName}
                    onChange={(event) => {
                      setPassengerName(event.target.value)
                      setConfirmation(null)
                      setBookingError('')
                    }}
                  />
                </label>
                <label className="field-group passenger-field" htmlFor="passenger-count">
                  <span>Passengers <small>(1–6)</small></span>
                  <input
                    id="passenger-count"
                    type="number"
                    min="1"
                    max="6"
                    step="1"
                    value={passengerCount}
                    onChange={(event) => {
                      setPassengerCount(event.target.value)
                      setConfirmation(null)
                      setBookingError('')
                    }}
                  />
                </label>

                <div className="total-row">
                  <span>Total fare</span>
                  <strong>{total === null ? '—' : formatInr(total)}</strong>
                </div>
                {bookingError && <p className="form-error" role="alert">{bookingError}</p>}
                <button className="confirm-button" type="submit">Confirm demo booking <span aria-hidden="true">→</span></button>
                <p className="fine-print">No payment or real traveller details required.</p>
              </form>
            ) : (
              <div className="booking-empty">
                <span className="empty-mark" aria-hidden="true">＋</span>
                <p>Select a flight to review the trip and see its total.</p>
              </div>
            )}
          </aside>
        </div>

        <footer className="page-footer">
          <span>Training Flights <b>·</b> Local demo</span>
          <span>Prices shown in INR <b>·</b> Departures in IST</span>
        </footer>
      </main>
    </div>
  )
}

export default App
