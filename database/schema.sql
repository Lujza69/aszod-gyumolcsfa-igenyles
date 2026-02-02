-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Inventory Table
create table inventory (
  id text primary key,
  name text not null,
  remaining integer not null default 0
);

-- Seed Inventory
insert into inventory (id, name, remaining) values
  ('barack', 'Barackfa', 50),
  ('szilva', 'Szilvafa', 50),
  ('korte', 'Körtefa', 50),
  ('hagyma', 'Virághagyma csomag', 210)
on conflict (id) do update set remaining = excluded.remaining;

-- Create Applications Table
create table applications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  fruit text references inventory(id),
  bulb boolean not null default false,
  created_at timestamptz default now()
);

-- Create RLS Policies (Optional but recommended for security, though we mostly use RPC)
alter table inventory enable row level security;
alter table applications enable row level security;

-- Client can read inventory to show current stock
create policy "Allow public read access to inventory"
  on inventory for select
  to anon
  using (true);

-- RPC Function for Atomic Transaction
create or replace function apply_request(
  p_name text,
  p_address text,
  p_fruit text,
  p_bulb boolean
) returns json as $$
declare
  v_fruit_stock int;
  v_bulb_stock int;
  v_application_id uuid;
begin
  -- Validate fruit stock
  select remaining into v_fruit_stock from inventory where id = p_fruit for update;
  if v_fruit_stock < 1 then
    raise exception 'A kiválasztott gyümölcsfa sajnos elfogyott.';
  end if;

  -- Validate bulb stock if requested
  if p_bulb then
    select remaining into v_bulb_stock from inventory where id = 'hagyma' for update;
    if v_bulb_stock < 1 then
       -- If bulbs are out, we could either fail or just not give one. 
       -- Requirement says: "Ha elfogy, az opció automatikusan tűnjön el" on frontend,
       -- but backend should also protect. Let's fail safe or just proceed without bulb?
       -- "Ha elfogy, ne legyen választható" implies strictness.
       raise exception 'A virághagyma sajnos elfogyott.';
    end if;
  end if;

  -- Update stocks
  update inventory set remaining = remaining - 1 where id = p_fruit;
  if p_bulb then
    update inventory set remaining = remaining - 1 where id = 'hagyma';
  end if;

  -- Insert Application
  insert into applications (name, address, fruit, bulb)
  values (p_name, p_address, p_fruit, p_bulb)
  returning id into v_application_id;

  return json_build_object('success', true, 'id', v_application_id);

exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$ language plpgsql security definer;
