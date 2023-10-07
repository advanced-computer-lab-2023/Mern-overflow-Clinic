import Doctor from '../../models/Doctor.js';

describe('Doctor model', () => {
  it('should throw an error if email is invalid', async () => {
    const doctor = new Doctor({
      username: 'testuser',
      name: 'Test User',
      email: 'invalidemail',
      passwordHash: 'password',
      dateOfBirth: new Date(),
      hourlyRate: 50,
      affiliation: 'Test Affiliation',
      education: 'Test Education',
      status: 'pending',
    });
    await expect(doctor.save()).rejects.toThrow('invalid email');
  });
});