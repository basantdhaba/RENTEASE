"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bed, Bath, Square, IndianRupee, Users, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import PropertyComparison from "./PropertyComparison"
import NotificationPreferences from "./NotificationPreferences"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaymentPrompt from "./PaymentPrompt"
import type { Property } from "@/models/Property"

export default function PropertyGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    pinCode: "",
    maxRent: "",
    bedrooms: "",
  })
  const { toast } = useToast()
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [isNotificationPreferencesOpen, setIsNotificationPreferencesOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/properties")
        if (!response.ok) {
          throw new Error("Failed to fetch properties")
        }
        const data = await response.json()
        setProperties(data)
      } catch (error) {
        console.error("Error fetching properties:", error)
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [toast])

  const filteredAndSortedProperties = useMemo(() => {
    return properties
      .filter(
        (property) =>
          (property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.pinCode?.includes(searchQuery) ||
            property.nearbyPlaces?.some((place) => place.toLowerCase().includes(searchQuery.toLowerCase())) ||
            property.type?.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (filters.pinCode ? property.pinCode === filters.pinCode : true) &&
          (filters.maxRent ? property.rent <= Number.parseInt(filters.maxRent) : true) &&
          (filters.bedrooms ? property.bedrooms === Number.parseInt(filters.bedrooms) : true),
      )
      .sort((a, b) => b.interestedTenants - a.interestedTenants)
  }, [searchQuery, filters, properties])

  const handlePropertyClick = (propertyId: number) => {
    try {
      const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("userToken")
      router.push(isLoggedIn ? `/property/${propertyId}` : `/login?redirect=/property/${propertyId}`)
    } catch (error) {
      console.error("Error navigating to property:", error)
      toast({
        title: "Error",
        description: "An error occurred while trying to view the property.",
        variant: "destructive",
      })
    }
  }

  const handleActionClick = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation()
    const property = filteredAndSortedProperties.find((p) => p.id === propertyId)
    if (property) {
      setSelectedProperty(property)
      setIsPaymentPromptOpen(true)
    }
  }

  const [isPaymentPromptOpen, setIsPaymentPromptOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Card key={n} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
              <div className="h-3 bg-muted rounded w-4/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search by location, road name, area, pin code, nearby places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsNotificationPreferencesOpen(true)}>Set Notifications</Button>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="PIN Code"
            value={filters.pinCode}
            onChange={(e) => setFilters((prev) => ({ ...prev, pinCode: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Max Rent"
            value={filters.maxRent}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxRent: e.target.value }))}
          />
          <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, bedrooms: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setFilters({ pinCode: "", maxRent: "", bedrooms: "" })} variant="outline">
            Clear Filters
          </Button>
        </div>
      </div>

      {selectedProperties.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <p>{selectedProperties.length} properties selected</p>
          <Button onClick={() => setIsComparing(true)} disabled={selectedProperties.length < 2}>
            Compare Selected
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProperties.map((property) => (
          <Card
            key={property.id}
            onClick={() => handlePropertyClick(property.id)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>{property.title}</CardTitle>
              <Badge>{property.type}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                  </span>
                  <span className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Square className="w-4 h-4 mr-1" />
                  {property.area} sq.ft
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Available from: {new Date(property.availableFrom).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm font-semibold text-blue-600">
                  <Users className="w-4 h-4 mr-1" />
                  {property.interestedTenants} interested tenant{property.interestedTenants !== 1 ? "s" : ""}
                </div>
                <p className="text-sm text-muted-foreground">{property.location}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    <span className="font-bold">{property.rent.toLocaleString("en-IN")}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProperties((prev) =>
                          prev.some((p) => p.id === property.id)
                            ? prev.filter((p) => p.id !== property.id)
                            : [...prev, property].slice(-3),
                        )
                      }}
                    >
                      {selectedProperties.some((p) => p.id === property.id) ? "Unselect" : "Select"}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={(e) => handleActionClick(e, property.id)}>
                      Interested
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isComparing && <PropertyComparison properties={selectedProperties} onClose={() => setIsComparing(false)} />}

      <NotificationPreferences
        isOpen={isNotificationPreferencesOpen}
        onClose={() => setIsNotificationPreferencesOpen(false)}
        onSave={(preferences) => {
          // Handle notification preferences
          console.log("Saving preferences:", preferences)
          setIsNotificationPreferencesOpen(false)
        }}
      />

      {selectedProperty && (
        <PaymentPrompt
          isOpen={isPaymentPromptOpen}
          onClose={() => setIsPaymentPromptOpen(false)}
          property={{
            ...selectedProperty,
            rent: selectedProperty.rent,
          }}
          isInterested={true}
          onConfirm={(whatsappNumber) => {
            // Handle interest confirmation
            console.log("Confirming interest:", { property: selectedProperty, whatsappNumber })
            // Update the interested tenants count
            const updatedProperties = properties.map((p) =>
              p.id === selectedProperty.id ? { ...p, interestedTenants: p.interestedTenants + 1 } : p,
            )
            setProperties(updatedProperties)
            setIsPaymentPromptOpen(false)
            toast({
              title: "Interest Confirmed",
              description: `You have successfully expressed interest in ${selectedProperty.title}`,
              duration: 5000,
            })
          }}
          onVideoRequest={(whatsappNumber) => {
            // Handle video request
            console.log("Requesting video:", { property: selectedProperty, whatsappNumber })
            setIsPaymentPromptOpen(false)
            toast({
              title: "Video Requested",
              description: `You will receive the video link for ${selectedProperty.title} on WhatsApp`,
              duration: 5000,
            })
          }}
        />
      )}
    </>
  )
}

