import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Property } from "@/lib/demo-data"

interface PropertyEditFormProps {
  property: Property
  onSave: (updatedProperty: Property) => void
  onCancel: () => void
}

export default function PropertyEditForm({ property, onSave, onCancel }: PropertyEditFormProps) {
  const [editedProperty, setEditedProperty] = useState<Property>({
    ...property,
    nearbyPlaces: Array.isArray(property.nearbyPlaces) ? property.nearbyPlaces : [],
    acceptableReligions: Array.isArray(property.acceptableReligions) ? property.acceptableReligions : [],
    furnishings: {
      ac: 0,
      geyser: 0,
      tv: 0,
      table: 0,
      chair: 0,
      ...(property.furnishings || {}),
    },
    tenantPreferences: {
      students: false,
      maleStudents: false,
      femaleStudents: false,
      family: false,
      familySize: "",
      sharing: false,
      ...(property.tenantPreferences || {}),
    },
    additionalFacilities: {
      food: false,
      wifi: false,
      parking: false,
      laundry: false,
      ...(property.additionalFacilities || {}),
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedProperty((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditedProperty((prev) => ({
      ...prev,
      additionalFacilities: { ...prev.additionalFacilities, [name]: checked },
    }))
  }

  const handleTenantPreferenceChange = (name: string, checked: boolean) => {
    setEditedProperty((prev) => ({
      ...prev,
      tenantPreferences: { ...prev.tenantPreferences, [name]: checked },
    }))
  }

  const handleNearbyPlacesChange = (value: string) => {
    setEditedProperty((prev) => ({
      ...prev,
      nearbyPlaces: value.split(",").map((place) => place.trim()),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedProperty)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={editedProperty.title} onChange={handleInputChange} required />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={editedProperty.type}
          onValueChange={(value) => setEditedProperty((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="Independent House">Independent House</SelectItem>
            <SelectItem value="Studio">Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            value={editedProperty.bedrooms}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            value={editedProperty.bathrooms}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="area">Area (sq ft)</Label>
          <Input
            id="area"
            name="area"
            type="number"
            value={editedProperty.area}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rent">Rent (₹)</Label>
        <Input id="rent" name="rent" type="number" value={editedProperty.rent} onChange={handleInputChange} required />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" value={editedProperty.location} onChange={handleInputChange} required />
      </div>

      <div>
        <Label htmlFor="pinCode">PIN Code</Label>
        <Input id="pinCode" name="pinCode" value={editedProperty.pinCode} onChange={handleInputChange} required />
      </div>

      <div>
        <Label htmlFor="nearbyPlaces">Nearby Places (comma-separated)</Label>
        <Input
          id="nearbyPlaces"
          name="nearbyPlaces"
          value={editedProperty.nearbyPlaces.join(", ")}
          onChange={(e) => handleNearbyPlacesChange(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="youtubeLink">YouTube Video Link</Label>
        <Input id="youtubeLink" name="youtubeLink" value={editedProperty.youtubeLink} onChange={handleInputChange} />
      </div>

      <div>
        <Label htmlFor="availableFrom">Available From</Label>
        <Input
          id="availableFrom"
          name="availableFrom"
          type="date"
          value={editedProperty.availableFrom}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="ownerWhatsApp">Owner's WhatsApp</Label>
        <Input
          id="ownerWhatsApp"
          name="ownerWhatsApp"
          value={editedProperty.ownerWhatsApp}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label>Additional Facilities</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(editedProperty.additionalFacilities).map(([facility, value]) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={facility}
                checked={value}
                onCheckedChange={(checked) => handleCheckboxChange(facility, checked as boolean)}
              />
              <Label htmlFor={facility} className="capitalize">
                {facility}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Tenant Preferences</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(editedProperty.tenantPreferences).map(([pref, value]) => {
            if (pref === "familySize") return null
            return (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={pref}
                  checked={value as boolean}
                  onCheckedChange={(checked) => handleTenantPreferenceChange(pref, checked as boolean)}
                />
                <Label htmlFor={pref} className="capitalize">
                  {pref.replace(/([A-Z])/g, " $1").trim()}
                </Label>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}

