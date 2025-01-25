"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useSettings } from "@/contexts/SettingsContext"
import PropertyEditForm from "@/components/PropertyEditForm"
import ErrorBoundary from "@/components/ErrorBoundary"
import type { Property } from "@/models/Property"

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [pendingProperties, setPendingProperties] = useState<Property[]>([])
  const [searchWhatsApp, setSearchWhatsApp] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [newVideoLink, setNewVideoLink] = useState("")
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { settings, updateSettings } = useSettings()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("adminToken")
        if (!token) {
          router.push("/admin/login")
        } else {
          setIsLoading(false)
          fetchProperties()
          fetchPendingProperties()
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        toast({
          title: "Authentication Error",
          description: "There was an error checking your authentication. Please try logging in again.",
          variant: "destructive",
        })
      }
    }
    checkAuth()
  }, [router, toast])

  const fetchProperties = async () => {
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
    }
  }

  const fetchPendingProperties = async () => {
    try {
      const response = await fetch("/api/properties?status=pending")
      if (!response.ok) {
        throw new Error("Failed to fetch pending properties")
      }
      const data = await response.json()
      setPendingProperties(data)
    } catch (error) {
      console.error("Error fetching pending properties:", error)
      toast({
        title: "Error",
        description: "Failed to load pending properties. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminToken")
      router.push("/admin/login")
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        title: "Logout Error",
        description: "There was an error during logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveChanges = () => {
    try {
      updateSettings(settings)
      toast({
        title: "Changes Saved",
        description: "Your changes have been successfully saved.",
      })
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Save Error",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateVideoLink = (property: Property) => {
    setSelectedProperty(property)
    setNewVideoLink(property.youtubeLink || "")
    setIsUpdateDialogOpen(true)
  }

  const handleSaveVideoLink = async () => {
    try {
      if (!selectedProperty) return

      const response = await fetch(`/api/properties/${selectedProperty.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeLink: newVideoLink }),
      })

      if (!response.ok) {
        throw new Error("Failed to update video link")
      }

      setProperties(properties.map((p) => (p.id === selectedProperty.id ? { ...p, youtubeLink: newVideoLink } : p)))
      setIsUpdateDialogOpen(false)
      toast({
        title: "Video Link Updated",
        description: `Updated video link for ${selectedProperty.title}`,
      })
    } catch (error) {
      console.error("Error updating video link:", error)
      toast({
        title: "Update Error",
        description: "There was an error updating the video link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property)
    setIsEditDialogOpen(true)
  }

  const handleSaveProperty = async (updatedProperty: Property) => {
    try {
      const response = await fetch(`/api/properties/${updatedProperty.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProperty),
      })

      if (!response.ok) {
        throw new Error("Failed to update property")
      }

      setProperties(properties.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)))
      setIsEditDialogOpen(false)
      toast({
        title: "Property Updated",
        description: `Updated details for ${updatedProperty.title}`,
      })
    } catch (error) {
      console.error("Error saving property:", error)
      toast({
        title: "Save Error",
        description: "There was an error saving the property details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveProperty = async (propertyId: number) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove property")
      }

      setProperties(properties.filter((p) => p.id !== propertyId))
      toast({
        title: "Property Removed",
        description: "The property has been removed from the site.",
      })
    } catch (error) {
      console.error("Error removing property:", error)
      toast({
        title: "Remove Error",
        description: "There was an error removing the property. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApprovePendingProperty = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve property")
      }

      setProperties([...properties, property])
      setPendingProperties(pendingProperties.filter((p) => p.id !== property.id))
      toast({
        title: "Property Approved",
        description: "The property has been approved and added to the main listing.",
      })
    } catch (error) {
      console.error("Error approving property:", error)
      toast({
        title: "Error",
        description: "There was an error approving the property. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectPendingProperty = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to reject property")
      }

      setPendingProperties(pendingProperties.filter((p) => p.id !== property.id))
      toast({
        title: "Property Rejected",
        description: "The property has been rejected and removed from the pending list.",
      })
    } catch (error) {
      console.error("Error rejecting property:", error)
      toast({
        title: "Error",
        description: "There was an error rejecting the property. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredProperties = properties.filter((property) => property.ownerWhatsApp.includes(searchWhatsApp))

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background p-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* UPI and Social Media Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment and Social Media Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label htmlFor="upiId" className="w-32">
                    UPI ID:
                  </label>
                  <Input
                    id="upiId"
                    value={settings.upiId}
                    onChange={(e) => updateSettings({ ...settings, upiId: e.target.value })}
                    className="flex-grow"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="facebook" className="w-32">
                    Facebook:
                  </label>
                  <Input
                    id="facebook"
                    value={settings.socialLinks.facebook}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                      })
                    }
                    className="flex-grow"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="twitter" className="w-32">
                    Twitter:
                  </label>
                  <Input
                    id="twitter"
                    value={settings.socialLinks.twitter}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                      })
                    }
                    className="flex-grow"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="instagram" className="w-32">
                    Instagram:
                  </label>
                  <Input
                    id="instagram"
                    value={settings.socialLinks.instagram}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                      })
                    }
                    className="flex-grow"
                  />
                </div>
              </div>
            </div>

            {/* Interested Fee Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Interested Fee Settings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rent Range (₹)</TableHead>
                    <TableHead>Fee (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.interestedFees.map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {index === 0 ? "0" : `${settings.interestedFees[index - 1].maxRent + 1}`} -
                        {tier.maxRent === Number.POSITIVE_INFINITY ? "Above" : tier.maxRent}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={tier.fee}
                          onChange={(e) => {
                            const newFees = [...settings.interestedFees]
                            newFees[index].fee = Number.parseInt(e.target.value)
                            updateSettings({ ...settings, interestedFees: newFees })
                          }}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Video Request Fee Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Video Request Fee Settings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rent Range (₹)</TableHead>
                    <TableHead>Fee (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.videoRequestFees.map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {index === 0 ? "0" : `${settings.videoRequestFees[index - 1].maxRent + 1}`} -
                        {tier.maxRent === Number.POSITIVE_INFINITY ? "Above" : tier.maxRent}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={tier.fee}
                          onChange={(e) => {
                            const newFees = [...settings.videoRequestFees]
                            newFees[index].fee = Number.parseInt(e.target.value)
                            updateSettings({ ...settings, videoRequestFees: newFees })
                          }}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Property Video Links and Management */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Property Management</h3>
              <div className="mb-4">
                <Input
                  placeholder="Search by owner's WhatsApp number"
                  value={searchWhatsApp}
                  onChange={(e) => setSearchWhatsApp(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Owner's WhatsApp</TableHead>
                    <TableHead>Video Link</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.title}</TableCell>
                      <TableCell>{property.ownerWhatsApp}</TableCell>
                      <TableCell>{property.youtubeLink || "Not set"}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button onClick={() => handleUpdateVideoLink(property)}>Update Video</Button>
                          <Button onClick={() => handleEditProperty(property)}>Edit Details</Button>
                          <Button variant="destructive" onClick={() => handleRemoveProperty(property.id)}>
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pending Properties Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Pending Properties</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Owner's WhatsApp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.ownerWhatsApp}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button onClick={() => handleApprovePendingProperty(property)}>Approve</Button>
                          <Button variant="destructive" onClick={() => handleRejectPendingProperty(property)}>
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button onClick={handleSaveChanges}>Save All Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Link Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Video Link</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newVideoLink}
                onChange={(e) => setNewVideoLink(e.target.value)}
                placeholder="Enter new YouTube link"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVideoLink}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Property Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Property Details</DialogTitle>
            </DialogHeader>
            {selectedProperty && (
              <PropertyEditForm
                property={selectedProperty}
                onSave={handleSaveProperty}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  )
}

