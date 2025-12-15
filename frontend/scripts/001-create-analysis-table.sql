-- Create analysis history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  query TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analysis
CREATE POLICY "Users can view own analysis" ON analysis_history
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own analysis
CREATE POLICY "Users can insert own analysis" ON analysis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_analysis_user_created ON analysis_history(user_id, created_at DESC);
