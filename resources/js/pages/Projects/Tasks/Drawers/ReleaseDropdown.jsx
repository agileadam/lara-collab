import { date } from '@/utils/datetime';
import { usePage } from '@inertiajs/react';
import {
  Box,
  ColorSwatch,
  Combobox,
  Group,
  Input,
  InputBase,
  Text,
  useCombobox,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export default function ReleaseDropdown({ value, onChange, ...props }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { releases } = usePage().props;
  const selectedRelease = releases?.find((r) => r.id === value);

  const handleSelect = (val) => {
    onChange(val ? Number(val) : null);
    combobox.closeDropdown();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Box {...props}>
      <Input.Label>Release</Input.Label>
      <Combobox
        store={combobox}
        onOptionSubmit={handleSelect}
        withinPortal={false}
        disabled={!can('edit task')}
      >
        <Combobox.Target>
          <InputBase
            component='button'
            type='button'
            pointer
            onClick={() => combobox.toggleDropdown()}
            rightSection={
              selectedRelease && can('edit task') ? (
                <IconX
                  size={14}
                  style={{ cursor: 'pointer' }}
                  onClick={handleClear}
                />
              ) : (
                <Combobox.Chevron />
              )
            }
            rightSectionPointerEvents={selectedRelease ? 'all' : 'none'}
          >
            {selectedRelease ? (
              <Group gap={7} justify='space-between' wrap='nowrap'>
                <Group gap={7}>
                  <ColorSwatch
                    color={selectedRelease.color || '#ced4da'}
                    size={10}
                  />
                  <Text size='sm'>{selectedRelease.name}</Text>
                </Group>
                {selectedRelease.target_date && (
                  <Text size='xs' c='dimmed'>{date(selectedRelease.target_date)}</Text>
                )}
              </Group>
            ) : (
              <Input.Placeholder>Select release</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {releases?.map((release) => (
              <Combobox.Option
                value={release.id.toString()}
                key={release.id}
                active={value === release.id}
              >
                <Group gap={7} justify='space-between' wrap='nowrap'>
                  <Group gap={7}>
                    <ColorSwatch
                      color={release.color || '#ced4da'}
                      size={10}
                    />
                    <Text size='sm'>{release.name}</Text>
                  </Group>
                  {release.target_date && (
                    <Text size='xs' c='dimmed'>{date(release.target_date)}</Text>
                  )}
                </Group>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}
