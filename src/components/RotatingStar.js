import React from 'react';
import { SvgIcon, keyframes } from '@mui/material';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const colors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  sapphire: '#0F52BA',
  titanium: '#878681',
};

const RotatingStar = ({ color = 'bronze', size = 40 }) => (
  <SvgIcon
    sx={{
      width: size,
      height: size,
      animation: `${rotate} 2s linear infinite`,
    }}
    viewBox="0 0 24 24"
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill={colors[color] || colors.bronze}
    />
  </SvgIcon>
);

export default RotatingStar;