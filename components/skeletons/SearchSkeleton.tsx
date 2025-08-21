import React from 'react';
import { View } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const SearchSkeleton = () => {
  return (
    <View className="bg-background-card flex-row mb-2 h-[7vh] rounded-xl items-center px-3">
      {/* Search icon skeleton */}
      <SkeletonLoader width={24} height={24} borderRadius={12} style={{ marginRight: 12 }} />
      
      {/* Search input skeleton */}
      <SkeletonLoader width="60%" height={20} borderRadius={4} />
      
      {/* Filter buttons skeleton */}
      <View className="flex-row ml-auto">
        <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginRight: 4 }} />
        <SkeletonLoader width={60} height={32} borderRadius={8} />
      </View>
    </View>
  );
};

export default SearchSkeleton;
