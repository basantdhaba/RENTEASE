import Header from "../components/Header"
import Hero from "../components/Hero"
import PropertyGrid from "../components/PropertyGrid"
import Footer from "../components/Footer"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome to the RentEase Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a fully functional demo of the RentEase platform. Here's how you can explore:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Browse properties below</li>
                  <li>Use the "I'm Interested" button to test the video request feature</li>
                  <li>
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Log in
                    </Link>{" "}
                    as a user (email: john@example.com, password: password123)
                  </li>
                  <li>
                    <Link href="/admin/login" className="text-blue-600 hover:underline">
                      Log in
                    </Link>{" "}
                    as an admin (email: admin@example.com, password: admin123)
                  </li>
                  <li>Try listing a new property</li>
                  <li>Explore the admin dashboard to manage properties and settings</li>
                </ul>
              </CardContent>
            </Card>
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Featured Properties</h2>
            <PropertyGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

