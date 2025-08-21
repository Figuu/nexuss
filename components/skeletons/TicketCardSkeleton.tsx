import React from 'react';
import { View } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const TicketCardSkeleton = () => {
  return (
    <View className="flex-row w-full bg-background-card rounded-xl mb-2 p-4">
      {/* QR Code skeleton */}
      <View className="h-[120px] aspect-square rounded-xl mr-4 overflow-hidden items-center justify-center">
        <SkeletonLoader width={110} height={110} borderRadius={12} />
      </View>
      
      {/* Content skeleton */}
      <View className="flex-1 mr-2">
        {/* Event name skeleton */}
        <SkeletonLoader width="90%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="70%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="50%" height={24} borderRadius={4} style={{ marginBottom: 16 }} />
        
        {/* Date skeleton */}
        <SkeletonLoader width="60%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
        
        {/* Ticket type skeleton */}
        <SkeletonLoader width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
        
        {/* Price skeleton */}
        <SkeletonLoader width="40%" height={16} borderRadius={4} />
      </View>
    </View>
  );
};

export default TicketCardSkeleton;
