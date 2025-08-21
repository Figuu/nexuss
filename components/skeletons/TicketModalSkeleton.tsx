import React from 'react';
import { View, ScrollView } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const TicketModalSkeleton = () => {
  return (
    <View className="flex-1 bg-background p-4">
      {/* Header skeleton */}
      <View className="flex-row items-center justify-between mb-6">
        <SkeletonLoader width={100} height={24} borderRadius={4} />
        <SkeletonLoader width={24} height={24} borderRadius={12} />
      </View>
      
      <ScrollView className="flex-1">
        {/* Ticket type selection skeleton */}
        <View className="mb-6">
          <SkeletonLoader width={120} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} className="bg-background-card p-4 rounded-xl mb-3">
              <SkeletonLoader width="80%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonLoader width="40%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <View className="flex-row justify-between items-center">
                <SkeletonLoader width={60} height={16} borderRadius={4} />
                <SkeletonLoader width={80} height={32} borderRadius={16} />
              </View>
            </View>
          ))}
        </View>
        
        {/* Quantity selector skeleton */}
        <View className="mb-6">
          <SkeletonLoader width={100} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          <View className="flex-row items-center justify-center space-x-4">
            <SkeletonLoader width={40} height={40} borderRadius={20} />
            <SkeletonLoader width={60} height={40} borderRadius={20} />
            <SkeletonLoader width={40} height={40} borderRadius={20} />
          </View>
        </View>
        
        {/* Total price skeleton */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center p-4 bg-background-card rounded-xl">
            <SkeletonLoader width={80} height={20} borderRadius={4} />
            <SkeletonLoader width={100} height={24} borderRadius={4} />
          </View>
        </View>
      </ScrollView>
      
      {/* Buy button skeleton */}
      <SkeletonLoader width="100%" height={48} borderRadius={24} />
    </View>
  );
};

export default TicketModalSkeleton;
