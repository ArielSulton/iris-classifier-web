export interface SpeciesColors {
  [key: string]: string;
}

export interface PredictionRequest {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
}

export interface PredictionResponse {
  prediction: string;
}