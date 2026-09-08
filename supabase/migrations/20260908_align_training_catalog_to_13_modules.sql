-- DASH MOBILE SERVICES: final 13-module training catalog alignment.
-- Home & Property Cleaning remains a customer-bookable service but is covered by House Cleaning training.
UPDATE public.employee_training_catalog
SET active=false, required=false
WHERE title IN ('Moving Services','Trash & Junk Removal','Garage Cleaning','Home & Property Cleaning');

INSERT INTO public.employee_training_catalog (title, description, required, active)
VALUES (
  'House Cleaning',
  'House Cleaning training covering booked rooms and areas, customer property and privacy, professional conduct, access information, accidental damage, confidentiality, and customer situations.',
  true,
  true
)
ON CONFLICT (title) DO UPDATE SET
  description=EXCLUDED.description,
  required=true,
  active=true;

UPDATE public.employee_training_catalog
SET required = CASE WHEN title IN (
  'Employee Policy Orientation','DASH Commercial','Company Orientation','Customer Service',
  'Communication & Teamwork','Safety','Attendance, Reliability & Accountability',
  'Professional Conduct & Confidentiality','Customer Property & Trust','Job Documentation & Recordkeeping',
  'Company Vehicles & Equipment','Core Automotive Services','Lawn & Property Care','House Cleaning','Master Test'
) THEN true ELSE false END,
active = CASE WHEN title IN (
  'Employee Policy Orientation','DASH Commercial','Company Orientation','Customer Service',
  'Communication & Teamwork','Safety','Attendance, Reliability & Accountability',
  'Professional Conduct & Confidentiality','Customer Property & Trust','Job Documentation & Recordkeeping',
  'Company Vehicles & Equipment','Core Automotive Services','Lawn & Property Care','House Cleaning','Master Test'
) THEN true ELSE active END
WHERE title IS NOT NULL;
