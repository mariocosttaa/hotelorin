/**
 * Cloud Storage Modal Component
 */


import { useState } from "react"
import { Cloud, Download, HardDrive, Smartphone, Upload, Wifi, WifiOff } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { CLOUD_STORAGE } from "../../constants/data"

interface CloudStorageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloudStorageModal({ open, onOpenChange }: CloudStorageModalProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 2000)
  }

  const usagePercentage = (CLOUD_STORAGE.used / CLOUD_STORAGE.total) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Storage
          </DialogTitle>
          <DialogDescription>Manage your cloud storage and sync settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Storage Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Used</span>
              <Badge variant={usagePercentage > 90 ? "destructive" : usagePercentage > 70 ? "secondary" : "default"}>
                {CLOUD_STORAGE.used}GB / {CLOUD_STORAGE.total}GB
              </Badge>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {CLOUD_STORAGE.files.toLocaleString()} files • Last sync: {CLOUD_STORAGE.lastSync}
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
              <div>
                <p className="text-sm font-medium">{isOnline ? "Connected" : "Offline"}</p>
                <p className="text-xs text-muted-foreground">
                  {isOnline ? "All files synced" : "Some files may not be up to date"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing || !isOnline}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>

          {/* Device Sync */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Synced Devices</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-sm">MacBook Pro</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">iPhone</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  2 hours ago
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>

          {usagePercentage > 90 && (
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-sm text-orange-800">
                Your storage is almost full. Consider upgrading your plan or removing unused files.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upgrade Plan
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
