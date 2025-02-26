import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Подключаемся к MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB подключен"))
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));

// Создаём модель сообщений
const MessageSchema = new mongoose.Schema({
  text: String,
});

const Message = mongoose.model("Message", MessageSchema);

// API: получить все сообщения
app.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// API: создать новое сообщение
app.post("/messages", async (req, res) => {
  const newMessage = new Message({ text: req.body.text });
  await newMessage.save();
  res.json(newMessage);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

// messages
app.get('/messages', async (req, res) => {
    res.json({ message: "I am" });
});

// console.log(messages)
app.get("/messages", async (req, res) => {
  const messages = await Message.find();
  console.log(messages); // Логируем сообщения
  res.json(messages);
});
