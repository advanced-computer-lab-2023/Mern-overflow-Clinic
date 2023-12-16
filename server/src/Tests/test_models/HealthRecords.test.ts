import { Types } from 'mongoose';
import HealthRecords from '../../models/HelthRecords.ts';

describe('health record model', () => {
    test('should throw an error if patient is missing', async () => {
        const healthRecordWithoutPatient = {
            diagnosis: 'Headache',
        };

        const healthRecord = new HealthRecords(healthRecordWithoutPatient);
        await expect(healthRecord.save()).rejects.toThrow('HealthRecords validation failed: patient: Path `patient` is required.');
    });

    test('should throw an error if diagnosis is missing', async () => {
        const healthRecordWithoutDiagnosis = {
            patient: new Types.ObjectId(),
        };

        const healthRecord = new HealthRecords(healthRecordWithoutDiagnosis);
        await expect(healthRecord.save()).rejects.toThrow('HealthRecords validation failed: diagnosis: Path `diagnosis` is required.');
    });

    test('should throw an error if diagnosis is empty', async () => {
        const healthRecordWithEmptyDiagnosis = {
            patient: new Types.ObjectId(),
            diagnosis: '',
        };

        const healthRecord = new HealthRecords(healthRecordWithEmptyDiagnosis);
        await expect(healthRecord.save()).rejects.toThrow('HealthRecords validation failed: diagnosis: Path `diagnosis` is required.');
    });

    test('should throw an error if patient is invalid', async () => {
        const healthRecordWithEmptyDiagnosis = {
            patient: 'hello world',
            diagnosis: 'Headache',
        };

        const healthRecord = new HealthRecords(healthRecordWithEmptyDiagnosis);
        await expect(healthRecord.save()).rejects.toThrow('HealthRecords validation failed: patient: Cast to ObjectId failed for value \"hello world\" (type string) at path \"patient\" because of \"BSONError\"');
    });

    test('should throw an error if date is invalid', async () => {
        const healthRecordWithEmptyDiagnosis = {
            patient: new Types.ObjectId(),
            diagnosis: 'Headache',
            date: "invalid"
        };

        const healthRecord = new HealthRecords(healthRecordWithEmptyDiagnosis);
        await expect(healthRecord.save()).rejects.toThrow('HealthRecords validation failed: date: Cast to date failed for value \"invalid\" (type string) at path \"date\"');
    });
});