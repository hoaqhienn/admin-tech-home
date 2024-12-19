import React, { useMemo, useState, useCallback } from 'react';
import { Select, MenuItem, TextField, InputAdornment, Box, SelectChangeEvent } from '@mui/material';
import { Search } from 'lucide-react';

interface Resident {
  residentId: number;
  fullname: string;
  idcard: string;
}

interface Apartment {
  residents: { residentId: number }[];
}

interface ResidentSelectorProps {
  residents: Resident[];
  apartment: Apartment;
  selectedResidentId: number | null;
  setSelectedResidentId: (id: number | null) => void;
}

const ResidentSelector: React.FC<ResidentSelectorProps> = ({
  residents,
  apartment,
  selectedResidentId,
  setSelectedResidentId,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState(false);

  const filteredResidents = useMemo(() => {
    const assignedResidentIds = new Set(apartment.residents.map(({ residentId }) => residentId));

    return residents.filter(
      ({ residentId, fullname, idcard }) =>
        !assignedResidentIds.has(residentId) &&
        (fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idcard.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [residents, apartment.residents, searchTerm]);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedResidentId(event.target.value === '' ? null : Number(event.target.value));
    setOpen(false);
  };

  // Prevent select from closing when interacting with the search field
  const handleSearchClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Prevent select from closing when typing
  const handleSearchKeyDown = useCallback((event: React.KeyboardEvent) => {
    event.stopPropagation();
  }, []);

  // Handle search input changes
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSearchTerm(event.target.value);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Select
        fullWidth
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false);
          setSearchTerm('');
        }}
        value={selectedResidentId ?? ''}
        onChange={handleChange}
        displayEmpty
        renderValue={(value) => {
          if (!value) {
            return <em>Chọn cư dân</em>;
          }
          const resident = residents.find((r) => r.residentId === value);
          return resident ? `${resident.fullname} (${resident.idcard})` : '';
        }}
      >
        <MenuItem
          sx={{
            p: 1,
            '&:hover': {
              backgroundColor: 'transparent',
            },
            cursor: 'default',
          }}
          disableRipple
          onClick={handleSearchClick}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Tìm theo tên hoặc CCCD"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onClick={handleSearchClick}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </MenuItem>
        <MenuItem value="" disabled>
          <em>Chọn cư dân</em>
        </MenuItem>
        {filteredResidents.map((resident) => (
          <MenuItem key={resident.residentId} value={resident.residentId}>
            ({resident.idcard}) {resident.fullname}
          </MenuItem>
        ))}
        {filteredResidents.length === 0 && <MenuItem disabled>Không tìm thấy cư dân</MenuItem>}
      </Select>
    </Box>
  );
};

export default ResidentSelector;
