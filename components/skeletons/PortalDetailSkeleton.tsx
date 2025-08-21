import React from 'react';
import { View } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const PortalDetailSkeleton = () => {
  return (
    <View className="flex-1 bg-background p-4">
      {/* Hero section skeleton */}
      <View className="w-[100vw] -mx-4 -mt-16">
        <SkeletonLoader width="100%" height="35vh" borderRadius={0} />
        
        {/* Profile image skeleton */}
        <View className="absolute bottom-[-2vh] left-[30vw]">
          <SkeletonLoader width="40vw" height="40vw" borderRadius={999} />
        </View>
      </View>
      
      <View className="mt-7 items-center">
        {/* Title skeleton */}
        <SkeletonLoader width="60%" height={48} borderRadius={4} style={{ marginBottom: 16 }} />
        
        {/* Description skeleton */}
        <View className="mt-2 w-full">
          <SkeletonLoader width="90%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="80%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="70%" height={20} borderRadius={4} style={{ marginBottom: 24 }} />
          
          {/* Social icons skeleton */}
          <View className="flex-row mt-6 justify-evenly space-x-0 mx-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonLoader key={index} width={24} height={24} borderRadius={12} />
            ))}
          </View>
          
          {/* Buttons skeleton */}
          <SkeletonLoader width="100%" height={48} borderRadius={16} style={{ marginTop: 32, marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={48} borderRadius={16} />
        </View>
      </View>
    </View>
  );
};

export default PortalDetailSkeleton;
