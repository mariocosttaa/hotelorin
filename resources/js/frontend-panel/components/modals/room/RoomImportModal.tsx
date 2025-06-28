import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/js/frontend-panel/components/ui/dialog';
import { Badge } from '@/js/frontend-panel/components/ui/badge';
import { Button } from '@/js/frontend-panel/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/js/frontend-panel/components/ui/card';
import { Tv, Download, Users, Baby, PawPrint, DollarSign } from 'lucide-react';
import RoomType from '@/js/shared/types/model/tenant/roomType';

// Helper for SVG cleaning
function stripSvgSize(svg: string) {
  return svg
    .replace(/class="[^"]*"/g, '')
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '');
}

interface RoomImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomTypes: RoomType[];
  onSelect: (roomType: RoomType) => void;
}

const RoomImportModal: React.FC<RoomImportModalProps> = ({ open, onOpenChange, roomTypes, onSelect }) => {
  const [selectedRoomType, setSelectedRoomType] = React.useState<RoomType | null>(null);

  const handleSelect = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
  };

  const handleImport = () => {
    if (selectedRoomType) {
      onSelect(selectedRoomType);
      setSelectedRoomType(null);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedRoomType(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Import from Room Type
          </DialogTitle>
          <DialogDescription>
            Select a room type to automatically import its details into your new room form.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {roomTypes.length === 0 ? (
            <div className="text-center py-8">
              <Tv className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold">No room types available</h3>
              <p className="text-sm text-muted-foreground">Create room types first to import from them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomTypes.map((roomType) => (
                <Card
                  key={roomType.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRoomType?.id === roomType.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-border'
                  }`}
                  onClick={() => handleSelect(roomType)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{roomType.name}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {roomType.description}
                        </p>

                        {/* Capacity Info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>2 adults</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Baby className="w-3 h-3" />
                            <span>2 children</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PawPrint className="w-3 h-3" />
                            <span>0 pets</span>
                          </div>
                        </div>

                        {/* Prices Preview */}
                        {roomType.prices && roomType.prices.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <DollarSign className="w-3 h-3" />
                              <span>Prices</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {roomType.prices.slice(0, 3).map((price) => (
                                <Badge key={price.currency_code} variant="outline" className="text-xs">
                                  <span className={price.status ? "" : "line-through opacity-70"}>
                                    {price.price_formatted}
                                  </span>
                                  {!price.status && (
                                    <span className="ml-1 text-xs">(I)</span>
                                  )}
                                  {price.price_ilustrative_formatted && (
                                    <span className="text-muted-foreground ml-1 line-through">
                                      {price.price_ilustrative_formatted}
                                    </span>
                                  )}
                                </Badge>
                              ))}
                              {roomType.prices.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{roomType.prices.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Amenities Preview */}
                        {roomType.comodites && roomType.comodites.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {roomType.comodites.slice(0, 4).map((roomComodite) => {
                              const comodite = roomComodite.comodite;
                              if (!comodite) return null;
                              return (
                                <Badge key={roomComodite.id} variant="secondary" className="text-xs flex items-center px-2 py-1">
                                  {comodite.icon ? (
                                    <span
                                      className="w-5 h-5 mr-1 flex items-center justify-center"
                                      dangerouslySetInnerHTML={{ __html: stripSvgSize(comodite.icon) }}
                                    />
                                  ) : (
                                    <span className="w-5 h-5 mr-1 bg-primary rounded-full"></span>
                                  )}
                                  {comodite.name}
                                </Badge>
                              );
                            })}
                            {roomType.comodites.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{roomType.comodites.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Gallery Preview */}
                      <div className="ml-4">
                        {roomType.galleries && roomType.galleries.length > 0 ? (
                          <div className="relative">
                            <img
                              src={roomType.galleries[0].src}
                              alt=""
                              className="w-16 h-16 rounded border object-cover"
                            />
                            {roomType.galleries.length > 1 && (
                              <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0">
                                +{roomType.galleries.length - 1}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded border bg-muted flex items-center justify-center">
                            <Tv className="w-6 h-6 opacity-30" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedRoomType && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleImport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Import {selectedRoomType.name}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoomImportModal;
