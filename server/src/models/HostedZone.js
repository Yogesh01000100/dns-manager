import mongoose from 'mongoose';

const hostedZoneSchema = new mongoose.Schema({
  Id: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  CallerReference: String,
  Config: {
    Comment: String,
    PrivateZone: Boolean
  },
  ResourceRecordSetCount: Number,
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DnsRecord' }]
});

export const HostedZone = mongoose.model('HostedZone', hostedZoneSchema);
