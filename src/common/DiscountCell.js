import React from 'react';
import Bullet, { Font, Margin, Size } from 'devextreme-react/bullet';
import { Typography } from '@mui/material';

function DiscountCell({ value }) {

  return (
    <div>
      <Bullet
        showTarget={false}
        showZeroLevel={true}
        value={value}
        startScaleValue={0}
        endScaleValue={100}
        dataField={value}
      >
        <Size width={150} height={20} />
        <Margin top={5} bottom={0} left={5} />
        <Font size={18} />
      </Bullet>
      <Typography sx={{
            display: 'flex',
            position: 'absolute',
            marginTop: '-17px',
            marginLeft: '17px',
            fontSize: '12px',
            fontWeight: 'bold'
      }}>{value}</Typography>
    </div>
  );
}

export default DiscountCell;
