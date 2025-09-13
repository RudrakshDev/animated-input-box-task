import { SearchInterface } from './components/search-interface'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <SearchInterface />
      <Analytics />
    </div>
  )
}

export default App