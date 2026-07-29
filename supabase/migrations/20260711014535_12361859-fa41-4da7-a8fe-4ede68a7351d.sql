
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "part public ins" ON public.participants;
CREATE POLICY "part public ins" ON public.participants FOR INSERT
  WITH CHECK (char_length(coalesce(name,'')) BETWEEN 1 AND 120);
