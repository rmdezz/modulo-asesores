import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save } from 'lucide-react';

const AreasDialog = ({ 
  open, 
  onOpenChange, 
  areas, 
  editingAreaIndex, 
  onEditArea, 
  onUpdateArea 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevas áreas temáticas</DialogTitle>
          <DialogDescription>
            Las siguientes áreas temáticas no existen en el sistema. Puede editarlas antes de que se registren.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {areas.map((area, index) => (
            <div key={index} className="space-y-1">
              <Label>Área {index + 1}</Label>
              <div className="flex space-x-2 items-center">
                <Input
                  value={editingAreaIndex === index ? area.name : areas[index].name}
                  onChange={(e) => onUpdateArea(index, e.target.value)}
                  disabled={editingAreaIndex !== index}
                />
                {editingAreaIndex === index ? (
                  <Button size="icon" onClick={() => onEditArea(null)}>
                    <Save className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="icon" onClick={() => onEditArea(index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreasDialog;