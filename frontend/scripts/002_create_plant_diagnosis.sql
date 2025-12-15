-- Create plant diagnosis table for crop disease detection
CREATE TABLE IF NOT EXISTS public.plant_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  disease_name TEXT,
  confidence NUMERIC,
  symptoms TEXT,
  treatment_recommendation TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  crop_type TEXT,
  diagnosed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.plant_diagnoses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own diagnoses"
  ON public.plant_diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON public.plant_diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnoses"
  ON public.plant_diagnoses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
  ON public.plant_diagnoses FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_plant_diagnoses_user_id ON public.plant_diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_diagnoses_created_at ON public.plant_diagnoses(created_at DESC);
