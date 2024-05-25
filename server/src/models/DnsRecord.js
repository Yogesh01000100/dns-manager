import mongoose from 'mongoose';

const dnsRecordSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Type: { type: String, required: true },
  TTL: { type: Number, required: true },
  ResourceRecords: [{ value: String }],
  zone: { type: String, ref: 'HostedZone', refPath: 'Id' }
});

export const DnsRecord = mongoose.model('DnsRecord', dnsRecordSchema);

  