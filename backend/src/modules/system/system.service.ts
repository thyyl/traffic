import { AuditLog } from '@modules/audit-log/audit-log.entity';
import { AuditLogService } from '@modules/audit-log/audit-log.service';
import { Injectable } from '@nestjs/common';
import { Between } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(private readonly auditLogService: AuditLogService) {}

  async getMostRecentSearches(): Promise<AuditLog[]> {
    return this.auditLogService.findManyAuditLogs({
      order: { createdAt: 'DESC' },
      take: 10
    });
  }

  async getPeriodicLogs(
    startTime: string,
    endTime: string,
    take = 10000,
    order: 'ASC' | 'DESC' = 'DESC'
  ): Promise<AuditLog[]> {
    const [formattedStartTime, formattedEndTime] = [
      this.formatDateTime(startTime),
      this.formatDateTime(endTime)
    ];

    this.assertStartTimeBeforeEndTime(formattedStartTime, formattedEndTime);

    return this.auditLogService.findManyAuditLogs({
      where: { createdAt: Between(formattedStartTime, formattedEndTime) },
      order: { createdAt: order },
      take
    });
  }

  async getTimeFrameLogsCount(
    startTime: string,
    endTime: string,
    interval: string
  ): Promise<string> {
    const logs = await this.getPeriodicLogs(startTime, endTime, 10000, 'ASC');
    return this.findPeakStartTime(logs, parseInt(interval));
  }

  findPeakStartTime(logs: AuditLog[], interval: number): string {
    const timeLogs = logs.map(({ createdAt }) => createdAt);
    const logsLength = timeLogs.length;

    // Initialize variables for sliding window
    let windowStart = 0;
    let maxCount = 0;
    let maxIntervalStartTime: Date | null = null;
    const windowCounts: Map<string, number> = new Map();

    for (let windowEnd = 0; windowEnd < logsLength; windowEnd++) {
      // Expand the window until it covers the specified interval
      while (
        timeLogs[windowEnd].getTime() - timeLogs[windowStart].getTime() >
        interval * 60 * 1000
      ) {
        const startTimeKey = `${timeLogs[windowStart].getHours()}:${timeLogs[
          windowStart
        ].getMinutes()}`;
        windowCounts.set(startTimeKey, windowCounts.get(startTimeKey) - 1);
        if (windowCounts.get(startTimeKey) === 0) {
          windowCounts.delete(startTimeKey);
        }
        windowStart++;
      }

      // Update counts within the window
      const endTimeKey = `${timeLogs[windowEnd].getHours()}:${timeLogs[
        windowEnd
      ].getMinutes()}`;
      windowCounts.set(endTimeKey, (windowCounts.get(endTimeKey) || 0) + 1);

      // Update max count and start time if needed
      if (windowEnd - windowStart + 1 > maxCount) {
        maxCount = windowEnd - windowStart + 1;
        maxIntervalStartTime = timeLogs[windowStart];
      }
    }

    return maxIntervalStartTime
      ? maxIntervalStartTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : '';
  }

  private formatDateTime(dateTime: string): Date {
    try {
      return new Date(dateTime);
    } catch (error) {
      throw new Error('Invalid date time format');
    }
  }

  private assertStartTimeBeforeEndTime(startTime: Date, endTime: Date) {
    if (startTime > endTime) {
      throw new Error('Start time must be before end time');
    }
  }
}
