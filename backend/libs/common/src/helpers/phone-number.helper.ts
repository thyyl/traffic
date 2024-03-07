import {
  getRegionCodeForCountryCode,
  parsePhoneNumber
} from 'awesome-phonenumber';

export class PhoneNumberParser {
  static formatPhoneNumber({
    phoneNumber,
    phoneCode,
    style
  }: {
    phoneNumber: string;
    phoneCode: string;
    style?: 'international' | 'national' | 'e164' | 'rfc3966';
  }): string {
    const countryCode = getRegionCodeForCountryCode(Number(phoneCode));
    const pn = parsePhoneNumber(phoneNumber, { regionCode: countryCode });

    if (!pn.valid) {
      throw new Error('Invalid phone number');
    }

    const tempPn = pn.number[style ?? 'international'];
    const pNumber = tempPn.replace(/[-\s]/g, '');
    return pNumber;
  }
}
