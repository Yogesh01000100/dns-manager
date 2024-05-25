import { route53 } from "../config/aws-config.js";
import { DnsRecord } from "../models/DnsRecord.js";

export const getRecords = async (req, res) => {
  const zoneId = req.query.zoneId;
  try {
    const records = await DnsRecord.find({ zone: zoneId });
    if (records.length > 0) {
      return res.status(200).json(records);
    } else {
      const params = { HostedZoneId: zoneId };
      const data = await route53.listResourceRecordSets(params).promise();
      for (const record of data.ResourceRecordSets) {
        const newRecord = new DnsRecord({
          name: record.Name,
          type: record.Type,
          ttl: record.TTL,
          resourceRecords: record.ResourceRecords.map((r) => ({
            value: r.Value,
          })),
          zone: zoneId,
        });
        await newRecord.save();
      }
      res.status(200).json(data.ResourceRecordSets);
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const createRecord = async (req, res) => {
  const { name, type, value, ttl, zoneId } = req.body;
  const params = {
    HostedZoneId: zoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "CREATE",
          ResourceRecordSet: {
            Name: name,
            Type: type,
            TTL: ttl,
            ResourceRecords: [{ Value: value }],
          },
        },
      ],
    },
  };

  try {
    const data = await route53.changeResourceRecordSets(params).promise();
    // next save to mongodb
    const newRecord = new DnsRecord({
      name,
      type,
      ttl,
      resourceRecords: [{ value }],
      zone: zoneId,
    });
    await newRecord.save();
    res
      .status(201)
      .json({ message: "Record created successfully", data: data.ChangeInfo });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const updateRecord = async (req, res) => {
  const { recordId, name, type, value, ttl } = req.body;
  const params = {
    HostedZoneId: req.body.zoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: name,
            Type: type,
            TTL: ttl,
            ResourceRecords: [{ Value: value }],
          },
        },
      ],
    },
  };

  try {
    const data = await route53.changeResourceRecordSets(params).promise();
    await DnsRecord.findByIdAndUpdate(
      recordId,
      {
        name,
        type,
        ttl,
        resourceRecords: [{ value }],
      },
      { new: true }
    );
    res.json({ message: "Record updated successfully", data: data.ChangeInfo });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const deleteRecord = async (req, res) => {
  const { recordId } = req.params;
  const params = {
    HostedZoneId: req.body.zoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Name: req.body.name,
            Type: req.body.type,
            TTL: req.body.ttl,
            ResourceRecords: [{ Value: req.body.value }],
          },
        },
      ],
    },
  };

  try {
    const data = await route53.changeResourceRecordSets(params).promise();
    await DnsRecord.findByIdAndRemove(recordId);
    res.json({ message: "Record deleted successfully", data: data.ChangeInfo });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const listHostedZones = async (req, res) => {
  try {
    const data = await route53.listHostedZones().promise();
    res.status(200).json({ hostedZones: data.HostedZones });
  } catch (error) {
    console.error("Failed to retrieve hosted zones:", error);
    res.status(500).json({ error: error.toString() });
  }
};

export const createDomain = async (req, res) => {
  const { domainName } = req.body;
  const params = {
    Name: domainName,
    CallerReference: Date.now().toString(),
  };

  try {
    const data = await route53.createHostedZone(params).promise();
    res
      .status(201)
      .json({ message: "Domain created successfully", data: data });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
