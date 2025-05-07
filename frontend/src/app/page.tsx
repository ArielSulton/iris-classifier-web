'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { SpeciesColors, PredictionRequest, PredictionResponse } from '@/types'

export default function Home() {
  const [form, setForm] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: '',
  });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestBody: PredictionRequest = {
        sepal_length: parseFloat(form.sepal_length),
        sepal_width: parseFloat(form.sepal_width),
        petal_length: parseFloat(form.petal_length),
        petal_width: parseFloat(form.petal_width),
      };

      const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error('Failed to get prediction');
      }

      const data: PredictionResponse = await res.json();
      setPrediction(data.prediction);
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formFields: { name: keyof typeof form; label: string }[] = [
    { name: 'sepal_length', label: 'Sepal Length' },
    { name: 'sepal_width', label: 'Sepal Width' },
    { name: 'petal_length', label: 'Petal Length' },
    { name: 'petal_width', label: 'Petal Width' },
  ];

  const getSpeciesColor = (species: string): string => {
    const colors: SpeciesColors = {
      'setosa': 'bg-green-500',
      'versicolor': 'bg-blue-500',
      'virginica': 'bg-purple-500'
    };
    return colors[species.toLowerCase()] || 'bg-slate-500';
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Iris Flower Predictor</CardTitle>
          <CardDescription className="text-center">Enter flower measurements to predict the iris species</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    placeholder="0.0"
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleSubmit} 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Predict Species'
              )}
            </Button>
          </div>
        </CardContent>
        
        {prediction && (
          <CardFooter className="flex flex-col items-center border-t pt-4">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Prediction Result:</p>
              <Badge className={`${getSpeciesColor(prediction)} text-white px-3 py-1 text-md font-medium`}>
                {prediction}
              </Badge>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}