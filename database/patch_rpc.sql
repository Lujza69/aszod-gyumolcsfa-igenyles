
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
  -- Validate fruit request if provided
  if p_fruit is not null and p_fruit <> '' then
      select remaining into v_fruit_stock from inventory where id = p_fruit for update;
      
      -- If invalid ID or 0 stock
      if v_fruit_stock is null or v_fruit_stock < 1 then
        raise exception 'A kiválasztott gyümölcsfa sajnos elfogyott.';
      end if;
      
      -- Update fruit stock
      update inventory set remaining = remaining - 1 where id = p_fruit;
  end if;

  -- Validate bulb stock if requested
  if p_bulb then
    select remaining into v_bulb_stock from inventory where id = 'hagyma' for update;
    if v_bulb_stock is null or v_bulb_stock < 1 then
       raise exception 'A virághagyma sajnos elfogyott.';
    end if;
    
    -- Update bulb stock
    update inventory set remaining = remaining - 1 where id = 'hagyma';
  end if;
  
  -- Ensure at least one item is requested
  if (p_fruit is null or p_fruit = '') and not p_bulb then
     raise exception 'Legalább egy tételt választani kell.';
  end if;

  -- Insert Application
  insert into applications (name, address, fruit, bulb)
  values (p_name, p_address, nullif(p_fruit, ''), p_bulb)
  returning id into v_application_id;

  return json_build_object('success', true, 'id', v_application_id);

exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$ language plpgsql security definer;
