const AnalyticsService = require('../utils/analyticsService');
const { getLastMonthDateRange } = require('../utils/dateUtils');

class AnalyticsController {
    // Export last month's borrowings
    static async exportLastMonthBorrowings(req, res) {
        try {
            const { start, end } = getLastMonthDateRange();
            const borrowings = await AnalyticsService.getBorrowingsByPeriod(start, end);
            
            const fields = [
                { label: 'Book Title', value: 'book_title' },
                { label: 'Borrower Name', value: 'borrower_name' },
                { label: 'Borrow Date', value: 'borrow_date' },
                { label: 'Due Date', value: 'due_date' },
                { label: 'Return Date', value: 'return_date' },
                { label: 'Status', value: 'status' }
            ];

            const csv = await AnalyticsService.exportToCSV(borrowings, fields);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=last-month-borrowings.csv');
            res.send(csv);
        } catch (error) {
            console.error('Error exporting last month\'s borrowings:', error);
            res.status(500).json({ message: 'Error exporting last month\'s borrowings' });
        }
    }

    // Export last month's overdue borrowings
    static async exportLastMonthOverdueBorrowings(req, res) {
        try {
            const { start, end } = getLastMonthDateRange();
            const overdueBorrowings = await AnalyticsService.getOverdueBorrowingsByPeriod(start, end);
            
            const fields = [
                { label: 'Book Title', value: 'book_title' },
                { label: 'Borrower Name', value: 'borrower_name' },
                { label: 'Borrower Email', value: 'borrower_email' },
                { label: 'Borrow Date', value: 'borrow_date' },
                { label: 'Due Date', value: 'due_date' },
                { label: 'Days Overdue', value: 'days_overdue' }
            ];

            const csv = await AnalyticsService.exportToCSV(overdueBorrowings, fields);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=last-month-overdue.csv');
            res.send(csv);
        } catch (error) {
            res.status(500).json({ message: 'Error exporting last month\'s overdue borrowings' });
        }
    }
    static async exportBorrowings(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required' });
            }

            const borrowings = await AnalyticsService.getBorrowingsByPeriod(startDate, endDate);
            
            const fields = [
                { label: 'Book Title', value: 'book_title' },
                { label: 'Borrower Name', value: 'borrower_name' },
                { label: 'Borrow Date', value: 'borrow_date' },
                { label: 'Due Date', value: 'due_date' },
                { label: 'Return Date', value: 'return_date' },
                { label: 'Status', value: 'status' }
            ];

            const csv = await AnalyticsService.exportToCSV(borrowings, fields);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=borrowings-${startDate}-to-${endDate}.csv`);
            res.send(csv);
        } catch (error) {
            res.status(500).json({ message: 'Error exporting borrowings' });
        }
    }

    static async exportOverdueBorrowings(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required' });
            }

            const overdueBorrowings = await AnalyticsService.getOverdueBorrowingsByPeriod(startDate, endDate);
            
            const fields = [
                { label: 'Book Title', value: 'book_title' },
                { label: 'Borrower Name', value: 'borrower_name' },
                { label: 'Borrower Email', value: 'borrower_email' },
                { label: 'Borrow Date', value: 'borrow_date' },
                { label: 'Due Date', value: 'due_date' },
                { label: 'Days Overdue', value: 'days_overdue' }
            ];

            const csv = await AnalyticsService.exportToCSV(overdueBorrowings, fields);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=overdue-borrowings-${startDate}-to-${endDate}.csv`);
            res.send(csv);
        } catch (error) {
            res.status(500).json({ message: 'Error exporting overdue borrowings' });
        }
    }
}

module.exports = AnalyticsController;
