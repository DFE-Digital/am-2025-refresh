const fs = require('fs');
const path = require('path');

const getFileMetadata = (filePath) => {
    try {
        const fullPath = path.join(__dirname, '..', 'app', 'views', filePath + '.html');
        const stats = fs.statSync(fullPath);
        return {
            created: stats.birthtime,
            modified: stats.mtime
        };
    } catch (error) {
        // Return default dates if file not found
        return {
            created: new Date('2025-01-01'),
            modified: new Date('2025-01-01')
        };
    }
};

const removeFilter = (filters, filterToRemove) => {
    const newFilters = {...filters };
    delete newFilters[filterToRemove];
    return Object.entries(newFilters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
};

const findServiceName = (services, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : '';
};

const findById = (items, id) => {
    return items.find(item => item.id === id);
};

const formatDateFilter = (value) => {
    switch (value) {
        case 'overdue':
            return 'Overdue';
        case 'next_month':
            return 'Next month';
        case 'next_3_months':
            return 'Next 3 months';
        case 'next_6_months':
            return 'Next 6 months';
        default:
            return value;
    }
};



function formatNumber(value) {
    const num = Number(value);
    if (Number.isNaN(num)) {
        // not a number – just return as-is
        return value;
    }

    const abs = Math.abs(num);



    // Under 1,000: commas, no decimals
    return num.toLocaleString('en-GB', {
        maximumFractionDigits: 0
    });
}


module.exports = {
    removeFilter,
    findServiceName,
    findById,
    formatDateFilter,
    formatNumber,
    getFileMetadata
};