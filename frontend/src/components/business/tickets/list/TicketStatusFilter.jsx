import { FilterDropdown } from '../../shared/FilterDropdown.jsx';

export function TicketStatusFilter({
  value,
  options = [],
  onChange,
  disabled = false,
}) {
  return (
    <FilterDropdown
      label="Status"
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
      emptyLabel="All statuses"
    />
  );
}
