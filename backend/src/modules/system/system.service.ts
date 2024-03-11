import { AuditLog } from '@modules/audit-log/audit-log.entity';
import { AuditLogService } from '@modules/audit-log/audit-log.service';
import { Injectable } from '@nestjs/common';
import { Between } from 'typeorm';
import { add, format } from 'date-fns';
import { UtilsHelper } from '@app/common';

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
    const map: { [key: string]: number } = {};

    timeLogs.forEach((log) => {
      const endTime = add(log, { hours: interval });
      const cutoffTimeLogs = this.searchForCutoffTime(timeLogs, log, endTime);
      const formattedTimeLog = format(log, 'yyyy-MM-dd HH:mm:ss');

      map[formattedTimeLog] = cutoffTimeLogs.length;
    });

    return UtilsHelper.getKeyWithHighestValue(map);
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

  private searchForCutoffTime(
    timeLogs: Date[],
    startTime: Date,
    endTime: Date
  ) {
    // return timeLogs.filter(
    //   (logTime) => logTime < endTime && logTime > startTime
    // );

    let low = 0;
    let high = timeLogs.length - 1;
    let startCutoffIndex = -1;
    let endCutoffIndex = -1;

    // Binary search to find the index where logs are equal or greater than the start time
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const logTime = new Date(timeLogs[mid]);

      if (logTime >= startTime) {
        startCutoffIndex = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    low = 0;
    high = timeLogs.length - 1;

    // Binary search to find the index where logs are equal or smaller than the end time
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const logTime = new Date(timeLogs[mid]);

      if (logTime <= endTime) {
        endCutoffIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // If no logs are found between the times, return an empty array
    if (startCutoffIndex === -1 || endCutoffIndex === -1) {
      return [];
    }

    // Return the logs between startCutoffIndex and endCutoffIndex (inclusive)
    return timeLogs.slice(startCutoffIndex, endCutoffIndex + 1);
  }
}
