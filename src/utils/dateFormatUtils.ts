const parseApiDate = (dateStr: string) => {
    if (!dateStr) return null;
    if (dateStr.includes(',')) {
        const [time, datePart] = dateStr.split(', ');
        const [day, month, year] = datePart.split('/');
        return new Date(`${year}-${month}-${day} ${time}`);
    }
    return new Date(dateStr);
};

const formatDate = (dateStr: string) => {
    const date = parseApiDate(dateStr);
    return date ? date.toLocaleString() : '-';
};

export { parseApiDate, formatDate };