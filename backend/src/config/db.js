const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB da ket noi');
  } catch (err) {
    console.error('Ket noi MongoDB that bai:', err.message);
    process.exit(1); // Khong co DB thi app vo nghia -> thoat han
  }
}

module.exports = connectDB;
