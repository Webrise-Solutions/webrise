CREATE TABLE public.audit_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_url TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_type TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX audit_requests_created_at_idx ON public.audit_requests (created_at DESC);

GRANT ALL ON public.audit_requests TO service_role;

ALTER TABLE public.audit_requests ENABLE ROW LEVEL SECURITY;