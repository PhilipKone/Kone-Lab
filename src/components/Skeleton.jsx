import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, height, width, borderRadius = '8px', className = '' }) => {
    const styles = {
        height: height || '20px',
        width: width || '100%',
        borderRadius: borderRadius,
    };

    if (type === 'workshop-card') {
        return (
            <div className={`skeleton-workshop-card shimmer ${className}`}>
                <div className="skeleton-image shimmer" />
                <div className="skeleton-line full mt-3" />
                <div className="skeleton-line medium mt-2" />
            </div>
        );
    }

    return (
        <div 
            className={`skeleton-base shimmer ${className}`} 
            style={styles} 
        />
    );
};

export default Skeleton;
