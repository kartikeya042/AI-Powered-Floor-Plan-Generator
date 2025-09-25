import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Download, Home, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import placeholderFloorplan from '@/assets/placeholder-floorplan.jpg';

interface FloorPlanInputs {
  squareFeet: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
}

const FloorPlanGenerator = () => {
  const [inputs, setInputs] = useState<FloorPlanInputs>({
    squareFeet: '',
    bedrooms: '',
    bathrooms: '',
    garages: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FloorPlanInputs, value: string) => {
    // Only allow positive numbers
    if (value === '' || /^\d+$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateInputs = (): boolean => {
    const { squareFeet, bedrooms, bathrooms, garages } = inputs;
    
    if (!squareFeet || !bedrooms || !bathrooms || !garages) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating a floor plan.",
        variant: "destructive"
      });
      return false;
    }

    const sqFt = parseInt(squareFeet);
    if (sqFt < 100 || sqFt > 10000) {
      toast({
        title: "Invalid Square Footage",
        description: "Square footage must be between 100 and 10,000.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const generateFloorPlan = async () => {
    if (!validateInputs()) return;

    setIsGenerating(true);

    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response - in a real app, this would be the backend response
      setGeneratedImage(placeholderFloorplan);
      
      toast({
        title: "Floor Plan Generated!",
        description: `Created a ${inputs.squareFeet} sq ft floor plan with ${inputs.bedrooms} bedrooms, ${inputs.bathrooms} bathrooms, and ${inputs.garages} garages.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `floorplan-${inputs.squareFeet}sqft-${inputs.bedrooms}bed-${inputs.bathrooms}bath.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your floor plan is being downloaded."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Home className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Floor Plan Generator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your requirements and let our AI create the perfect floor plan for your dream home
          </p>
        </div>

        {/* Input Form */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-foreground">Floor Plan Specifications</h2>
            <p className="text-muted-foreground">Provide the details for your custom floor plan</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="squareFeet" className="text-foreground font-medium">
                  Total Square Feet
                </Label>
                <Input
                  id="squareFeet"
                  type="text"
                  placeholder="e.g., 2500"
                  value={inputs.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-foreground font-medium">
                  Number of Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="text"
                  placeholder="e.g., 3"
                  value={inputs.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-foreground font-medium">
                  Number of Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="text"
                  placeholder="e.g., 2"
                  value={inputs.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="garages" className="text-foreground font-medium">
                  Number of Garages
                </Label>
                <Input
                  id="garages"
                  type="text"
                  placeholder="e.g., 2"
                  value={inputs.garages}
                  onChange={(e) => handleInputChange('garages', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <Button
              onClick={generateFloorPlan}
              disabled={isGenerating}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-semibold py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Floor Plan...
                </>
              ) : (
                'Generate Floor Plan'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Floor Plan Display */}
        {generatedImage && (
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Your Generated Floor Plan</h3>
                <p className="text-muted-foreground">
                  {inputs.squareFeet} sq ft • {inputs.bedrooms} bed • {inputs.bathrooms} bath • {inputs.garages} garage
                </p>
              </div>
              <Button
                onClick={downloadImage}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-border text-foreground hover:bg-accent"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden bg-background border border-border">
                <img
                  src={generatedImage}
                  alt="Generated floor plan"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FloorPlanGenerator;