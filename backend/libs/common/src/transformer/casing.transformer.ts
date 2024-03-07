import { ValueTransformer } from 'typeorm';

export class UpperCaseTransformer implements ValueTransformer {
  to(value: string) {
    return value?.toUpperCase();
  }
  from(value: string) {
    return value?.toUpperCase();
  }
}

export class LowerCaseTransformer implements ValueTransformer {
  to(value: string) {
    return typeof value !== 'string' ? value : value?.toLowerCase();
  }
  from(value: string) {
    return typeof value !== 'string' ? value : value?.toLowerCase();
  }
}
