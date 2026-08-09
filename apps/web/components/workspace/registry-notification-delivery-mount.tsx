'use client';

import { RegistryNotificationDeliveryPanel } from './registry-notification-delivery-panel';

type RegistryNotificationDeliveryMountProps = {
  notificationId: string;
  className?: string;
  compact?: boolean;
};

export function RegistryNotificationDeliveryMount({
  notificationId,
  className = '',
  compact = false,
}: RegistryNotificationDeliveryMountProps) {
  if (!notificationId) {
    return null;
  }

  return (
    <RegistryNotificationDeliveryPanel
      notificationId={notificationId}
      className={className}
      compact={compact}
    />
  );
}
