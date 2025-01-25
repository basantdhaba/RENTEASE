import { Search } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Rental Property</h1>
        <p className="text-xl mb-8 text-primary-foreground/80">Thousands of properties for rent in your area</p>
        <div className="max-w-2xl mx-auto">
          <form className="flex">
            <input
              type="text"
              placeholder="Enter city, neighborhood, or address"
              className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
            />
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-6 py-2 rounded-r-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent flex items-center transition-colors"
            >
              <Search className="mr-2" />
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

