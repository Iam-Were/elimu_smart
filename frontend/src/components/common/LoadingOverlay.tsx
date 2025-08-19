import React from 'react';
import { LoadingOverlay as MantineLoadingOverlay, Overlay } from '@mantine/core';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  zIndex?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  zIndex = 1000,
}) => {
  if (!visible) return null;

  return (
    <>
      <Overlay
        color="var(--background)"
        backgroundOpacity={0.7}
        blur={2}
        zIndex={zIndex}
      />
      <MantineLoadingOverlay
        visible={visible}
        zIndex={zIndex + 1}
        overlayProps={{ 
          radius: 'sm',
          blur: 2,
          backgroundOpacity: 0,
        }}
        loaderProps={{
          color: 'var(--primary)',
          size: 'md',
        }}
      />
    </>
  );
};