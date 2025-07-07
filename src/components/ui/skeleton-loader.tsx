"use client";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonLoader = ({ count = 5, className }: { count?: number, className?: string }) => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <Skeleton count={count} className={className} />
        </SkeletonTheme>
    );
};

export default SkeletonLoader; 