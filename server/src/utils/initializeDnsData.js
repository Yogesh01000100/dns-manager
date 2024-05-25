import { route53 } from "./config/aws-config";
import { DnsRecord, HostedZone } from "./models";

export const initializeDnsData = async () => {
  try {
    const hostedZones = await route53.listHostedZones().promise();

    for (const zone of hostedZones.HostedZones) {
      const mongoZone = new HostedZone({
        zoneId: zone.Id,
        name: zone.Name,
        callerReference: zone.CallerReference,
        config: {
          comment: zone.Config.Comment,
          privateZone: zone.Config.PrivateZone,
        },
      });

      await mongoZone.save();

      const records = await route53
        .listResourceRecordSets({ HostedZoneId: zone.Id })
        .promise();

      for (const record of records.ResourceRecordSets) {
        const newRecord = new DnsRecord({
          name: record.Name,
          type: record.Type,
          ttl: record.TTL,
          resourceRecords: record.ResourceRecords.map((r) => ({
            value: r.Value,
          })),
          zone: mongoZone._id,
        });

        await newRecord.save();
      }
    }
  } catch (error) {
    throw new Error(`Initialization failed: ${error.message}`);
  }
};
