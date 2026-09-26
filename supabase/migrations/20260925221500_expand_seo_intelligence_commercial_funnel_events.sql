alter table public.ta14_seo_intelligence_events
  drop constraint if exists ta14_seo_intelligence_events_event_type_check;

alter table public.ta14_seo_intelligence_events
  add constraint ta14_seo_intelligence_events_event_type_check
  check (
    event_type = any (
      array[
        'page_view'::text,
        'click'::text,
        'commercial_intent'::text,
        'pricing_viewed'::text,
        'bounded_exam_clicked'::text,
        'intake_started'::text,
        'intake_completed'::text,
        'payment_started'::text,
        'payment_completed'::text,
        'examination_delivered'::text,
        'expanded_engagement_started'::text
      ]
    )
  );
