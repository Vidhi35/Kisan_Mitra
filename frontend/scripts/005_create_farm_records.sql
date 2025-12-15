-- Create farm records table for tracking activities
CREATE TABLE IF NOT EXISTS public.farm_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('planting', 'irrigation', 'fertilizer', 'pesticide', 'harvest', 'expense', 'income', 'other')),
  crop_name TEXT,
  description TEXT NOT NULL,
  quantity NUMERIC,
  unit TEXT,
  cost NUMERIC DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.farm_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own records"
  ON public.farm_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own records"
  ON public.farm_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records"
  ON public.farm_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records"
  ON public.farm_records FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS farm_records_updated_at ON public.farm_records;
CREATE TRIGGER farm_records_updated_at
  BEFORE UPDATE ON public.farm_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_farm_records_user ON public.farm_records(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_records_date ON public.farm_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_farm_records_type ON public.farm_records(record_type);
