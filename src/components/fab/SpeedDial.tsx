import { SpeedDial, SpeedDialAction } from '@mui/material';
import { Menu } from 'lucide-react';
import { theme } from 'theme/theme';

export interface SpeedDialActionType {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

interface SpeedDialProps {
  actions: SpeedDialActionType[];
}

export const SpeedDialCustom = ({ actions }: SpeedDialProps) => {
  return (
    <>
      <SpeedDial
        ariaLabel="floor actions"
        sx={{ position: 'fixed', bottom: theme.spacing(10), right: theme.spacing(2) }}
        icon={<Menu />}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.title}
            icon={action.icon}
            tooltipTitle={action.title}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </>
  );
};
