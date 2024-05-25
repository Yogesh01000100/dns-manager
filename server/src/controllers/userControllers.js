import { DnsRecord, HostedZone, User } from '../models';

// Fetch DNS records for a specific user
export async function fetchUserDnsRecords(req, res) {
    const { userId } = req.params;

    try {
        const userRecords = await DnsRecord.find({ userId });
        res.status(200).json(userRecords);
    } catch (error) {
        res.status(500).send(`Error fetching DNS records for user: ${error}`);
    }
}

// Add a DNS record for a user
export async function addUserDnsRecord(req, res) {
    const { userId } = req.params;
    const { name, type, ttl, values, zoneId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newRecord = new DnsRecord({
            name,
            type,
            ttl,
            resourceRecords: values.map(value => ({ value })),
            userId,
            zone: zoneId
        });

        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).send(`Error adding DNS record: ${error}`);
    }
}

// Update a DNS record
export async function updateDnsRecord(req, res) {
    const { recordId } = req.params;
    const { name, type, ttl, values } = req.body;

    try {
        const updatedRecord = await DnsRecord.findByIdAndUpdate(recordId, {
            name,
            type,
            ttl,
            resourceRecords: values.map(value => ({ value }))
        }, { new: true });

        if (!updatedRecord) {
            return res.status(404).send('DNS Record not found');
        }

        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).send(`Error updating DNS record: ${error}`);
    }
}

// Delete a DNS record
export async function deleteDnsRecord(req, res) {
    const { recordId } = req.params;

    try {
        const deletedRecord = await DnsRecord.findByIdAndDelete(recordId);
        if (!deletedRecord) {
            return res.status(404).send('DNS Record not found');
        }

        res.status(200).send('DNS Record deleted successfully');
    } catch (error) {
        res.status(500).send(`Error deleting DNS record: ${error}`);
    }
}
