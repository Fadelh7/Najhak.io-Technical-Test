const User = require('./models/User');

const mockUsers = [
  { name: 'John Admin', email: 'admin@najhak.io', password: 'password123', role: 'admin' },
  { name: 'Sarah Manager', email: 'manager@najhak.io', password: 'password123', role: 'manager' },
];

const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding mock users...');
      await User.insertMany(mockUsers);
      console.log('Mock users seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

module.exports = seedUsers;
