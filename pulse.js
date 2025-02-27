import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Логируем переменные окружения перед подключением
console.log("🔍 MONGO_URL:", process.env.MONGO_URL);
console.log("🔍 PORT:", process.env.PORT);

// Подключаемся к MongoDB
async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 секунд на подключение
      connectTimeoutMS: 10000, // 10 секунд на установку соединения
      dbName: "aion-db", // Явно указываем базу
    });
    console.log("✅ MongoDB подключен!");
  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error);
    process.exit(1); // Остановка процесса при ошибке
  }
}

await connectToMongo(); // Подключаемся к базе перед запуском сервера

// Создаём модель сообщений
const MessageSchema = new mongoose.Schema({ text: String });
const Message = mongoose.model("Message", MessageSchema);

// Проверяем и создаем коллекцию, если пустая
async function ensureCollectionExists() {
  try {
    const count = await Message.countDocuments();
    if (count === 0) {
      await Message.create({ text: "Привет, я тестовое сообщение!" });
      console.log("📌 Тестовое сообщение добавлено в базу.");
    } else {
      console.log("✅ Коллекция уже существует, данные есть.");
    }
  } catch (err) {
    console.error("❌ Ошибка при создании коллекции:", err);
  }
}

await ensureCollectionExists(); // Проверяем коллекцию перед запуском сервера

// API: получить все сообщения
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    console.log("📨 Отправлены сообщения:", messages);
    res.json(messages);
  } catch (err) {
    console.error("❌ Ошибка при получении сообщений:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// API: создать новое сообщение
app.post("/messages", async (req, res) => {
  try {
    const newMessage = new Message({ text: req.body.text });
    await newMessage.save();
    console.log("🆕 Добавлено сообщение:", newMessage);
    res.json(newMessage);
  } catch (err) {
    console.error("❌ Ошибка при создании сообщения:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));

// Код, который не прокатил с чудовищем
async function testMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 секунд на подключение
    });

    console.log("✅ Успешное подключение к MongoDB!");

    // Создаём тестовую запись в базе
    const TestSchema = new mongoose.Schema({ message: String });
    const TestModel = mongoose.model("Test", TestSchema);

    const testEntry = new TestModel({ message: "Привет, MongoDB!" });
    await testEntry.save();

    console.log("📌 Данные успешно записаны в базу!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error);
  }
}

testMongoConnection();
