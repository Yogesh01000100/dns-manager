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
      Id: data.HostedZone.Id,
      Name: data.HostedZone.Name,
      CallerReference: data.HostedZone.CallerReference,
      config: {
        Comment: data.HostedZone.Config.Comment,
        PrivateZone: data.HostedZone.Config.PrivateZone,
      },
      ResourceRecordSetCount: data.HostedZone.ResourceRecordSetCount,
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
        const Id = zone.Id.split("/").pop();

        return {
          Id: Id,
          Name: zone.Name,
          CallerReference: zone.CallerReference,
          Config: {
            Comment: zone.Config.Comment,
            PrivateZone: zone.Config.PrivateZone,
          },
          ResourceRecordSetCount: zone.ResourceRecordSetCount,
        };
      })
    );

    res.status(200).json({ hostedZones });
  } catch (error) {
    console.error("Failed to retrieve hosted zones:", error);
    res.status(500).json({ error: error.toString() });
  }
};
