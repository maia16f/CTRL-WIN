import React from 'react';
import { Marker } from 'react-native-maps';

const SpottedMarker = ({ report }) => {
  return (
    <Marker
      coordinate={{
        latitude: report.location.latitude,
        longitude: report.location.longitude,
      }}
      pinColor="blue"
    />
  );
};

export default SpottedMarker;
