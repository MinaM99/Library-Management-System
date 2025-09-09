// Helper function to get last month's date range
const getLastMonthDateRange = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    return {
        start: lastMonth,
        end: lastMonthEnd
    };
};

module.exports = {
    getLastMonthDateRange
};
