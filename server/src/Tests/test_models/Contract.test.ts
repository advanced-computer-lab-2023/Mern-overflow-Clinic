import { Types } from 'mongoose';
import Contract from '../../models/Contract.ts';

describe('contract model', () => {
    test('should throw an error if doctor is missing', async () => {
        const contractWithoutDoctor = {
            admin: new Types.ObjectId(),
            clinicMarkup: 10,
        };

        const contract = new Contract(contractWithoutDoctor);
        await expect(contract.save()).rejects.toThrow('Contract validation failed: doctor: Path `doctor` is required.');
    });

    test('should throw an error if admin is missing', async () => {
        const contractWithoutAdmin = {
            doctor: new Types.ObjectId(),
            clinicMarkup: 10,
        };

        const contract = new Contract(contractWithoutAdmin);
        await expect(contract.save()).rejects.toThrow('Contract validation failed: admin: Path `admin` is required.');
    });

    test('should throw an error if clinicMarkup is missing', async () => {
        const contractWithoutMarkup = {
            doctor: new Types.ObjectId(),
            admin: new Types.ObjectId(),
        };

        const contract = new Contract(contractWithoutMarkup);
        await expect(contract.save()).rejects.toThrow('Contract validation failed: clinicMarkup: Path `clinicMarkup` is required.');
    });

    test('should throw an error if clinicMarkup is below the minimum value', async () => {
        const contractWithInvalidMarkup = {
            doctor: new Types.ObjectId(),
            admin: new Types.ObjectId(),
            clinicMarkup: -5,
        };

        const contract = new Contract(contractWithInvalidMarkup);
        await expect(contract.save()).rejects.toThrow('Contract validation failed: clinicMarkup: Path `clinicMarkup` (-5) is less than minimum allowed value (0).');
    });

    test('should throw an error if clinicMarkup is above the maximum value', async () => {
        const contractWithInvalidMarkup = {
            doctor: new Types.ObjectId(),
            admin: new Types.ObjectId(),
            clinicMarkup: 105,
        };

        const contract = new Contract(contractWithInvalidMarkup);
        await expect(contract.save()).rejects.toThrow('Contract validation failed: clinicMarkup: Path `clinicMarkup` (105) is more than maximum allowed value (100).');
    });
});
