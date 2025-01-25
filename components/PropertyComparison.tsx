import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Property } from "./PropertyGrid"

interface PropertyComparisonProps {
  properties: Property[]
  onClose: () => void
}

export default function PropertyComparison({ properties, onClose }: PropertyComparisonProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Property Comparison</DialogTitle>
          <DialogDescription>Compare selected properties side by side</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {properties.map(property => (
            <div key={property.id} className="space-y-2">
              <h3 className="font-bold">{property.title}</h3>
              <p>Type: {property.type}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Bathrooms: {property.bathrooms}</p>
              <p>Area: {property.area} sq.ft</p>
              <p>Rent: ₹{property.rent.toLocaleString('en-IN')}/month</p>
              <p>Location: {property.location}</p>
              <p>Pin Code: {property.pinCode}</p>
              <p>Nearby Places: {property.nearbyPlaces.join(', ')}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

