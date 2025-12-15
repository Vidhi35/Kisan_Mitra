-- Create weather alerts table
CREATE TABLE IF NOT EXISTS public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  state TEXT,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('heavy_rain', 'drought', 'cyclone', 'heatwave', 'frost', 'general')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (all users can view alerts)
CREATE POLICY "Anyone can view active weather alerts"
  ON public.weather_alerts FOR SELECT
  USING (is_active = TRUE);

-- Only admins can manage alerts
CREATE POLICY "Admins can insert weather alerts"
  ON public.weather_alerts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update weather alerts"
  ON public.weather_alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add updated_at trigger
DROP TRIGGER IF EXISTS weather_alerts_updated_at ON public.weather_alerts;
CREATE TRIGGER weather_alerts_updated_at
  BEFORE UPDATE ON public.weather_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_weather_alerts_location ON public.weather_alerts(location);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_active ON public.weather_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_date ON public.weather_alerts(start_date DESC);
