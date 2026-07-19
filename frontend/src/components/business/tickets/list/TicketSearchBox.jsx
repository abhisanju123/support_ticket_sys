import { SearchInput } from '../../shared/SearchInput.jsx';

export function TicketSearchBox({
  value,
  onChange,
  onSubmit,
  disabled = false,
}) {
  return (
    <SearchInput
      label="Search tickets"
      placeholder="Search by title, people, priority, status, date, or ticket #"
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      disabled={disabled}
    />
  );
}
