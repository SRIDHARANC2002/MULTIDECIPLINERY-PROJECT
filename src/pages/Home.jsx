import Header from '../components/Header'
import LocationSelector from '../components/LocationSelector'
import RouteResult from '../components/RouteResult'
import MapPlaceholder from '../components/MapPlaceholder'

function Home() {
  return (
    <div className="home">
      <Header />

      <LocationSelector />

      <MapPlaceholder />

      <RouteResult />
    </div>
  )
}

export default Home
