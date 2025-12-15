-- Create market rates table for crop prices
CREATE TABLE IF NOT EXISTS public.market_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  variety TEXT,
  market_location TEXT NOT NULL,
  state TEXT,
  price_per_quintal NUMERIC NOT NULL,
  price_change NUMERIC DEFAULT 0,
  min_price NUMERIC,
  max_price NUMERIC,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (all users can read market data)
ALTER TABLE public.market_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view market rates"
  ON public.market_rates FOR SELECT
  USING (true);

-- Only admins can insert/update market rates (will add admin check later)
CREATE POLICY "Admins can insert market rates"
  ON public.market_rates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update market rates"
  ON public.market_rates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add updated_at trigger
DROP TRIGGER IF EXISTS market_rates_updated_at ON public.market_rates;
CREATE TRIGGER market_rates_updated_at
  BEFORE UPDATE ON public.market_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_market_rates_crop ON public.market_rates(crop_name);
CREATE INDEX IF NOT EXISTS idx_market_rates_location ON public.market_rates(market_location);
CREATE INDEX IF NOT EXISTS idx_market_rates_date ON public.market_rates(date DESC);
