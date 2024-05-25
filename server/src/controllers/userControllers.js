import { route53 } from "../config/aws-config.js";
import { HostedZone } from "../models/HostedZone.js";

// adds the domain to route53 service
export const createDomain = async (req, res) => {
  const { domainName } = req.body;
  const params = {
    Name: domainName,
    CallerReference: Date.now().toString(),
  };

  try {
    const data = await route53.createHostedZone(params).promise();

    const newHostedZone = new HostedZone({
      zoneId: data.HostedZone.Id,
      name: data.HostedZone.Name,
      callerReference: data.HostedZone.CallerReference,
      config: {
        comment: data.HostedZone.Config.Comment,
        privateZone: data.HostedZone.Config.PrivateZone,
      },
    });
    await newHostedZone.save();

    res.status(201).json({ message: "Domain created successfully", data });
  } catch (error) {
    console.error("Failed to create domain:", error);
    res.status(500).json({ error: error.toString() });
  }
};

// lists the user domains
export const listHostedZones = async (req, res) => {
  try {
    let hostedZones = await HostedZone.find({});
    if (hostedZones.length > 0) {
      return res.status(200).json({ hostedZones });
    }
    const awsHostedZones = await route53.listHostedZones().promise();
    hostedZones = await HostedZone.insertMany(
      awsHostedZones.HostedZones.map((zone) => {
        const ZoneId = zone.Id.split("/").pop();

        return {
          zoneId: ZoneId,
          name: zone.Name,
          callerReference: zone.CallerReference,
          config: {
            comment: zone.Config.Comment,
            privateZone: zone.Config.PrivateZone,
          },
          recordSetCount: zone.ResourceRecordSetCount,
        };
      })
    );

    res.status(200).json({ hostedZones });
  } catch (error) {
    console.error("Failed to retrieve hosted zones:", error);
    res.status(500).json({ error: error.toString() });
  }
};
