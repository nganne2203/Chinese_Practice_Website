import dayjs from "dayjs";

export const createTimeValidator = (type: 'start' | 'end') => ({ getFieldValue }: any) => ({
    validator(_: any, value: any) {
        const isTimed = getFieldValue('timed');
        if (!isTimed) return Promise.resolve();

        if (!value) {
            return Promise.reject(
                new Error(`${type === 'start' ? 'Start' : 'End'} time is required when quiz is timed`)
            );
        }

        // ✅ Chuyển sang dayjs an toàn
        const start = getFieldValue('startTime');
        const startTime = start ? dayjs(start) : null;
        const endTime = value ? dayjs(value) : null;
        const now = dayjs().second(0).millisecond(0);

        if (!endTime?.isValid()) {
            return Promise.reject(new Error('Invalid date format'));
        }

        if (type === 'start' && endTime.isBefore(now)) {
            return Promise.reject(new Error('Start time must be present or future'));
        }

        if (type === 'end' && startTime && endTime.isBefore(startTime)) {
            return Promise.reject(new Error('End time must be after start time'));
        }

        return Promise.resolve();
    },
});
