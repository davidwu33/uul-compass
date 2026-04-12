-- Growth Priorities table
-- Run this against your Supabase database directly (SQL editor or psql)

CREATE TYPE growth_priority_status AS ENUM ('active', 'planned');

CREATE TABLE growth_priorities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status growth_priority_status NOT NULL DEFAULT 'planned',
  icon VARCHAR(100) NOT NULL DEFAULT 'star',
  sort_order INTEGER NOT NULL DEFAULT 0,
  metrics JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed with existing hardcoded priorities
INSERT INTO growth_priorities (name, description, status, icon, sort_order, metrics) VALUES
  (
    'AIDC & Energy Infrastructure',
    'Data center buildout logistics — transformers, switchgear, GPU racks, cooling systems, BESS. Speed to power is the competitive moat.',
    'active', 'bolt', 0,
    '[{"label":"Pipeline","value":"3 prospects"},{"label":"Avg Deal Size","value":"$2-5M"},{"label":"Win Rate","value":"TBD"}]'
  ),
  (
    'New Key Customers',
    'Land high-margin, high-velocity accounts. Focus on PE-backed AIDC developers, advanced manufacturing, and energy transition companies.',
    'active', 'group_add', 1,
    '[{"label":"Targets Identified","value":"20"},{"label":"Active Outreach","value":"4"},{"label":"Closed","value":"0"}]'
  ),
  (
    'Cross-Sell Existing Accounts',
    'Existing customers only use 1-2 services. Map all capabilities to customer needs and expand wallet share.',
    'planned', 'swap_horiz', 2,
    '[{"label":"Accounts Mapped","value":"0 / 20"},{"label":"Revenue Uplift Target","value":"10-20%"},{"label":"Campaign Launch","value":"Phase 2"}]'
  ),
  (
    'Pricing Optimization',
    'Audit legacy pricing, implement surcharges, correct below-cost accounts. 1% pricing improvement = 6% profit improvement in logistics.',
    'active', 'price_change', 3,
    '[{"label":"Audit Progress","value":"In Progress"},{"label":"Corrections Applied","value":"0"},{"label":"Impact Target","value":"+3-5% revenue"}]'
  ),
  (
    'New Regional Markets',
    'Mexico, Indonesia & Malaysia, Nordic Europe — new offices to capture nearshoring, ASEAN growth, and European energy infrastructure demand.',
    'planned', 'public', 4,
    '[{"label":"Markets","value":"4 regions"},{"label":"Offices Opened","value":"0 / 4"},{"label":"Timeline","value":"Phase 2-3"}]'
  );
