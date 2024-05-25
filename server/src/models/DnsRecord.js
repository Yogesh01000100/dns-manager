import mongoose from 'mongoose';

const dnsRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  ttl: { type: Number, required: true },
  resourceRecords: [{ value: String }],
  zone: { type: String, ref: 'HostedZone', refPath: 'zoneId' }
});

export const DnsRecord = mongoose.model('DnsRecord', dnsRecordSchema);

  