
create or replace function delete_application(p_application_id uuid)
returns json as $$
declare
  v_fruit text;
  v_bulb boolean;
begin
  -- Get application details to know what to restore
  select fruit, bulb into v_fruit, v_bulb from applications where id = p_application_id;

  if not found then
    return json_build_object('success', false, 'error', 'Application not found');
  end if;

  -- Delete the application
  delete from applications where id = p_application_id;

  -- Restore stock
  if v_fruit is not null then
    update inventory set remaining = remaining + 1 where id = v_fruit;
  end if;

  if v_bulb then
    update inventory set remaining = remaining + 1 where id = 'hagyma';
  end if;

  return json_build_object('success', true);
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$ language plpgsql security definer;
