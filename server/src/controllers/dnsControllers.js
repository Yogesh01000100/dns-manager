import { route53 } from "../config/aws-config";

export const getRecords = async (req, res) => {
  const zoneId = req.body.zoneId;
  const params = {
    HostedZoneId: zoneId,
  };

  try {
    const data = await route53.listResourceRecordSets(params).promise();
    res.status(200).json({ data: data.ResourceRecordSets });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const createRecord = async (req, res) => {
  const { name, type, value, ttl } = req.body;
  const params = {
    HostedZoneId: process.env.AWS_HOSTED_ZONE_ID,
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
    res.json({ message: "Record created successfully", data: data.ChangeInfo });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const updateRecord = async (req, res) => {
  const { name, type, value, ttl } = req.body;
  const params = {
    HostedZoneId: process.env.AWS_HOSTED_ZONE_ID,
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
    res.json({ message: "Record updated successfully", data: data.ChangeInfo });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const deleteRecord = async (req, res) => {
  const { name, type, value, ttl } = req.body;
  const params = {
    HostedZoneId: process.env.AWS_HOSTED_ZONE_ID,
    ChangeBatch: {
      Changes: [
        {
          Action: "DELETE",
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
