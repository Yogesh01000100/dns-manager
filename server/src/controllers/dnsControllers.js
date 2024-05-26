import { route53 } from "../config/aws-config.js";
import { DnsRecord } from "../models/DnsRecord.js";
import { HostedZone } from "../models/HostedZone.js";

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
    if (data.ChangeInfo.Status === "PENDING") {
      const newRecord = new DnsRecord({
        Name: name,
        Type: type,
        TTL: ttl,
        ResourceRecords: [{ value: value }],
        zone: zoneId,
      });
      await newRecord.save();
      await HostedZone.findOneAndUpdate(
        { Id: zoneId },
        { $inc: { ResourceRecordSetCount: 1 } },
        { new: true }
      );
      res.status(201).json({
        message: "Record created successfully",
        data: data.ChangeInfo,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

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
          Name: record.Name,
          Type: record.Type,
          TTL: record.TTL,
          ResourceRecords: record.ResourceRecords.map((r) => ({
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

export const updateRecord = async (req, res) => {
  const { recordId, name, type, values, ttl, zoneId } = req.body;

  const resourceRecords = Array.isArray(values) ? values : [values];

  const params = {
    HostedZoneId: zoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: name,
            Type: type,
            TTL: ttl,
            ResourceRecords: resourceRecords.map((value) => ({ Value: value })),
          },
        },
      ],
    },
  };

  try {
    const data = await route53.changeResourceRecordSets(params).promise();
    const updatedRecord = await DnsRecord.findByIdAndUpdate(
      recordId,
      {
        Name: name,
        Type: type,
        TTL: ttl,
        ResourceRecords: resourceRecords.map((value) => ({ value })),
      },
      { new: true }
    );

    if (updatedRecord) {
      res.status(200).json({
        message: "Record updated successfully",
        data: data.ChangeInfo,
      });
    } else {
      throw new Error("No corresponding local record found");
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const deleteRecord = async (req, res) => {
  const { recordId, zoneId } = req.body;

  try {
    const record = await DnsRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    const params = {
      HostedZoneId: zoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: "DELETE",
            ResourceRecordSet: {
              Name: record.Name,
              Type: record.Type,
              TTL: record.TTL,
              ResourceRecords: record.ResourceRecords.map((r) => ({
                Value: r.value,
              })),
            },
          },
        ],
      },
    };

    const data = await route53.changeResourceRecordSets(params).promise();
    await DnsRecord.findByIdAndDelete(recordId);
    await HostedZone.findOneAndUpdate(
      { Id: zoneId },
      { $inc: { ResourceRecordSetCount: -1 } }
    );

    res
      .status(200)
      .json({ message: "Record deleted successfully", data: data.ChangeInfo });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
