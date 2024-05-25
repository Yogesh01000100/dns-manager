import mongoose from 'mongoose';

const hostedZoneSchema = new mongoose.Schema({
  zoneId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  callerReference: String,
  config: {
    comment: String,
    privateZone: Boolean
  },
  recordSetCount: Number,
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DnsRecord' }]
});

export const HostedZone = mongoose.model('HostedZone', hostedZoneSchema);
