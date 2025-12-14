require("dotenv").config();
const { faker } = require("@faker-js/faker");
const sequelize = require("./config/db");
const Order = require("./models/order")(sequelize);

async function generateFakeOrders(count = 50) {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const quantity = faker.number.int({ min: 1, max: 5 });
    const pricePerItem = Number(faker.commerce.price({ min: 20, max: 120, dec: 2 }));
    const totalPrice = (pricePerItem * quantity).toFixed(2);
    const orderNotes = faker.helpers.arrayElement([
  "Leave at front door",
  "Call me when arriving",
  "Deliver to reception desk",
  "Hand over only to the recipient",
  "Please avoid ringing the bell",
  "Gate code: 4921",
  "Leave in parcel locker",
  "Beware of dog",
  "Fragile items, handle with care",
  "Place under the doormat"
]);


    orders.push({
      customerEmail: faker.internet.email(),
      customerName: faker.person.fullName(),
      customerAddress: faker.location.streetAddress() + ", " +
                       faker.location.city() + ", " +
                       faker.location.state() + ", " +
                       faker.location.country(),

      productName: faker.commerce.productName(),
      quantity: quantity,
      status: faker.helpers.arrayElement(["pending", "processing", "shipped", "delivered"]),

      // NEW FIELDS
      orderDate: faker.date.between({
        from: "2023-01-01",
        to: new Date()
      }),

      totalPrice: totalPrice,
      orderNotes:orderNotes
    });
  }

  return orders;
}

async function seed() {
  try {
    console.log("🌱 Connecting to database...");
    await sequelize.authenticate();

    console.log("🧹 Syncing tables...");
    await sequelize.sync();

    console.log("📦 Generating fake orders...");
    const orders = await generateFakeOrders(50);

    console.log("📥 Inserting fake orders...");
    await Order.bulkCreate(orders);

    console.log("✅ Seeder completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding orders:", err);
    process.exit(1);
  }
}

seed();
