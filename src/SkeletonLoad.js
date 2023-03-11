import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';

const SkeletonLoad = ({ count }) => {
    const skeletonItems = [];
  
    for (let i = 0; i < count; i++) {
      skeletonItems.push(
        <div>
          <Skeleton sx={{ bgcolor: 'grey.900' }}
        variant="rectangular"
        width={210}
        height={118} key={i}/>
        </div>
        
      );
    }
  
    return <>{skeletonItems}</>;
  };
  
  SkeletonLoad.propTypes = {
    count: PropTypes.number.isRequired,
  };
  
  export default SkeletonLoad;
  