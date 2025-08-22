import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { NODE_DEFINITIONS, NodeType } from '@/data/nodeDefinitions';

interface NodeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onSave: (nodeId: string, label: string, config: any) => void;
}

const NodeConfigurationModal: React.FC<NodeConfigurationModalProps> = ({
  isOpen,
  onClose,
  node,
  onSave
}) => {
  const [label, setLabel] = useState('');
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setConfig(node.data.config || {});
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, label, config);
    onClose();
  };

  const getNodeTypeLabel = (type: NodeType) => {
    const definition = NODE_DEFINITIONS[type];
    return definition ? definition.defaultLabel : 'Node';
  };

  const renderConfiguration = () => {
    const nodeType = node.type as NodeType;
    const definition = NODE_DEFINITIONS[nodeType];
    
    if (!definition) return null;

    return (
      <div className="space-y-4">
        {Object.entries(definition.configSchema).map(([key, schema]: [string, any]) => (
          <div key={key}>
            <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
            
            {schema.type === 'select' && (
              <Select 
                value={config[key] || ''} 
                onValueChange={(value) => setConfig({...config, [key]: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent>
                  {schema.options.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {schema.type === 'number' && (
              <Input
                type="number"
                value={config[key] || ''}
                onChange={(e) => setConfig({...config, [key]: parseInt(e.target.value) || schema.default || 0})}
                placeholder={schema.default?.toString() || '0'}
              />
            )}
            
            {schema.type === 'text' && (
              <Input
                value={config[key] || ''}
                onChange={(e) => setConfig({...config, [key]: e.target.value})}
                placeholder={`Enter ${key}`}
              />
            )}
            
            {schema.type === 'boolean' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={config[key] || false}
                  onCheckedChange={(checked) => setConfig({...config, [key]: checked})}
                />
                <Label htmlFor={key} className="text-sm font-normal">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
              </div>
            )}
            
            {schema.type === 'template_picker' && (
              <Input
                value={config[key] || ''}
                onChange={(e) => setConfig({...config, [key]: e.target.value})}
                placeholder="Template name"
              />
            )}
            
            {schema.type === 'range' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`${key}_min`}>Min</Label>
                  <Input
                    type="number"
                    value={config[key]?.min || ''}
                    onChange={(e) => setConfig({
                      ...config, 
                      [key]: { ...config[key], min: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <Label htmlFor={`${key}_max`}>Max</Label>
                  <Input
                    type="number"
                    value={config[key]?.max || ''}
                    onChange={(e) => setConfig({
                      ...config, 
                      [key]: { ...config[key], max: parseInt(e.target.value) || 100 }
                    })}
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {getNodeTypeLabel(node.type)} Node</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="label">Node Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node label"
            />
          </div>
          
          {renderConfiguration()}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NodeConfigurationModal;