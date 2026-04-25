-- 遗嘱项目MVP数据库schema
-- 创建时间: 2026-04-22

-- 用户表
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 遗嘱表
CREATE TABLE IF NOT EXISTS public.wills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  will_data JSONB NOT NULL,
  will_draft TEXT NOT NULL,
  complexity_score INTEGER NOT NULL DEFAULT 0,
  complexity_level TEXT NOT NULL,
  suggested_tier TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 律师预约表
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  will_id UUID REFERENCES public.wills(id) ON DELETE SET NULL,
  lawyer_name TEXT NOT NULL,
  lawyer_tier TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  contact_phone TEXT,
  contact_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_wills_user_id ON public.wills(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Row Level Security (RLS) 策略
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 用户只能操作自己的数据
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own wills" ON public.wills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own wills" ON public.wills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wills" ON public.wills FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- 开启实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE public.wills;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
