// server.js
const express = require("express");
const { DataSource } = require("typeorm");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Config ve env
dotenv.config();
const ormconfig = require("./config/config");

// --- BASE PATH ---
const basePath = "/api";

// Auth middleware
const { checkUser } = require("./middlewares/authMiddleware");

// --- PATH KONTROL ---
const pathsToCheck = [
  "../node.tatilial.com/middlewares/authMiddleware",
  "../node.tatilial.com/config/config",
  "../node.tatilial.com/models/AfrikaVeOrtadoguTurlari/AfrikaVeOrtadoguTurlariModel",
  "../node.tatilial.com/models/DubaiTurlari/dubaiturlari",
  "../node.tatilial.com/models/OrtaLatinAmerikaTurları/ortaLatinAmerıkaTurları",
  "../node.tatilial.com/models/AsyaVeUzakDoguTuru/AsyaVeUzakDoguTuru",
  "../node.tatilial.com/models/yunanAdalariTurları/yunanAdalarıTurlarıModel",
  "../node.tatilial.com/models/Iletısım/iletısımModel",
  "../node.tatilial.com/models/rezervation/rezervasyon"
];

console.log("🧪 Path Kontrol Başlatıldı...\n");
pathsToCheck.forEach((p) => {
  const resolvedPath = path.resolve(__dirname, p);
  const exists =
    fs.existsSync(resolvedPath + ".js") || fs.existsSync(resolvedPath + "/index.js");
  console.log(`${p} -> ${exists ? "✅ Dosya bulundu" : "❌ Dosya bulunamadı"}`);
});
console.log("\n✅ Path kontrolü tamamlandı.\n");
// const AfrikaVeOrtadoguTurlari = require("../node.tatilial.com/models/AfrikaVeOrtadoguTurlari/AfrikaVeOrtadoguTurlariModel");

// MODELLER
const Customer = require("./config/config");
const AfrikaVeOrtadoguTurlari = require("./models/ AfrikaVeOrtadoguTurlari/AfrikaVeOrtadoguTurlariModel");
const ortaLatinAmerikaTurlari = require("./models/OrtaLatinAmerikaTurları/ortaLatinAmerıkaTurları");
const AsyaVeUzakDoguTuru = require("./models/AsyaVeUzakDoguTuru/AsyaVeUzakDoguTuru");
const yunanAdalariTurlariModel = require("./models/yunanAdalariTurları/yunanAdalarıTurlarıModel");
const iletisimModel = require("./models/Iletısım/iletısımModel");
const rezervasyon = require("./models/rezervation/rezervasyon");

const dubaiturlari = require("./models/DubaiTurlari/dubaiturlari");


// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.send("Ana sayfaya hoş geldiniz!");
});

// Test route
app.get(`${basePath}/hello`, (req, res) => res.send("Hello World!"));

// TypeORM DataSource
const AppDataSource = new DataSource({
  ...ormconfig,
  entities: [
    Customer,
    dubaiturlari,
    
    AfrikaVeOrtadoguTurlari,
    ortaLatinAmerikaTurlari,
    AsyaVeUzakDoguTuru,
    yunanAdalariTurlariModel,
    iletisimModel,
    rezervasyon,
  ],
  synchronize: true,
});

// --- PROTECTED ROUTES ---
const protectedRoutes = express.Router();
protectedRoutes.use(checkUser);

// --- ENDPOINTLER ---

// Dubai Turları
app.get(`${basePath}/dubai-turlari`, async (req, res) => {
  try {
    const turlar = await AppDataSource.getRepository(dubaiturlari).find();
    res.json(turlar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post(`${basePath}/dubai-turlari`, async (req, res) => {
  try {
    const newTur = AppDataSource.getRepository(dubaiturlari).create(req.body);
    const result = await AppDataSource.getRepository(dubaiturlari).save(newTur);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put(`${basePath}/dubai-turlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(dubaiturlari);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.update(id, req.body);
    res.json(await repo.findOneBy({ id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete(`${basePath}/dubai-turlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(dubaiturlari);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.remove(tur);
    res.json({ message: "Tur başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// asyaortadoğu
app.get(`${basePath}/asya-ve-uzakdoguturlari`, async (req, res) => {
  try {
    const turlar = await AppDataSource.getRepository(AsyaVeUzakDoguTuru).find();
    res.json(turlar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post(`${basePath}/asya-ve-uzakdoguturlari`, async (req, res) => {
  try {
    const newTur = AppDataSource.getRepository(AsyaVeUzakDoguTuru).create(req.body);
    const result = await AppDataSource.getRepository(AsyaVeUzakDoguTuru).save(newTur);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put(`${basePath}asya-ve-uzakdoguturlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(AsyaVeUzakDoguTuru);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.update(id, req.body);
    res.json(await repo.findOneBy({ id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete(`${basePath}asya-ve-uzakdoguturlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(AsyaVeUzakDoguTuru);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.remove(tur);
    res.json({ message: "Tur başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// iletişim start

app.post(`${basePath}/iletisim`, async (req, res) => {
  try {
    const body = req.body;

    // Veritabanına kaydet
    const newEntry = AppDataSource.getRepository(iletisimModel).create(body);
    const result = await AppDataSource.getRepository(iletisimModel).save(newEntry);

    // Nodemailer ayarları
    const transporter = nodemailer.createTransport({
      host: "ampere.ishostname.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@tatilial.com",
        pass: "20011969Og", // Burada gerçek şifren var
      },
    });

    // Mail içeriği
    const mailOptions = {
      from: '"Tatilial İletişim" <info@tatilial.com>',
      to: "info@tatilial.com",
      subject: `Yeni İletişim Talebi: ${body.konu || "Konu belirtilmemiş"}`,
      text: `
Yeni iletişim talebi alındı:

Ad Soyad: ${body.adSoyad || "-"}
Telefon: ${body.telefon || "-"}
Konu: ${body.konu || "-"}
Mesaj: ${body.mesaj || "-"}
      `,
    };

    // Mail gönderimi
    const mailInfo = await transporter.sendMail(mailOptions);
    console.log("📧 Mail başarıyla gönderildi:", mailInfo.response);

    res.status(201).json(result);
  } catch (error) {
    console.error("🚨 Hata:", error);
    res.status(400).json({ message: error.message });
  }
});


// Yunan Adaları
app.get(`${basePath}/yunan-adalari`, async (req, res) => {
  try {
    const turlar = await AppDataSource.getRepository(yunanAdalariTurlariModel).find();
    res.json(turlar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



//orta latin amerika 
app.get(`${basePath}/orta-latinAmerika-turlari`, async (req, res) => {
  try {
    const turlar = await AppDataSource.getRepository(ortaLatinAmerikaTurlari).find();
    res.json(turlar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post(`${basePath}/orta-latinAmerika-turlari`, async (req, res) => {
  try {
    const newTur = AppDataSource.getRepository(ortaLatinAmerikaTurlari).create(req.body);
    const result = await AppDataSource.getRepository(ortaLatinAmerikaTurlari).save(newTur);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put(`${basePath}/orta-latinAmerika-turlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(ortaLatinAmerikaTurlari);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.update(id, req.body);
    res.json(await repo.findOneBy({ id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete(`${basePath}/orta-latinAmerika-turlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(ortaLatinAmerikaTurlari);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.remove(tur);
    res.json({ message: "Tur başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Afrika ve Ortadoğu Turları
app.get(`${basePath}/afrika-ve-ortadogu-turlari`, async (req, res) => {
  try {
    const turlar = await AppDataSource.getRepository(AfrikaVeOrtadoguTurlari).find();
    res.json(turlar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post(`${basePath}/afrika-ve-ortadogu-turlari`, async (req, res) => {
  try {
    const newTur = AppDataSource.getRepository(AfrikaVeOrtadoguTurlari).create(req.body);
    const result = await AppDataSource.getRepository(AfrikaVeOrtadoguTurlari).save(newTur);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put(`${basePath}/afrika-ve-ortadogu-turlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(AfrikaVeOrtadoguTurlari);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.update(id, req.body);
    res.json(await repo.findOneBy({ id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete(`${basePath}/afrika-ve-ortadogu-turlari/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(AfrikaVeOrtadoguTurlari);
    const tur = await repo.findOneBy({ id });
    if (!tur) return res.status(404).json({ message: "Tur bulunamadı." });
    await repo.remove(tur);
    res.json({ message: "Tur başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Rezervasyon
app.post(`${basePath}/rezervasyon`, async (req, res) => {
  try {
    const newRez = AppDataSource.getRepository(rezervasyon).create(req.body);
    const result = await AppDataSource.getRepository(rezervasyon).save(newRez);

    const transporter = nodemailer.createTransport({
      host: "ampere.ishostname.com",
      port: 465,
      secure: true,
      auth: { user: "info@tatilial.com", pass: "20011969Og" },
    });

    await transporter.sendMail({
      from: '"Tatilial Rezervasyon" <info@tatilial.com>',
      to: "info@tatilial.com",
      subject: "Yeni Rezervasyon Talebi",
      html: `
        <h2>Yeni Rezervasyon Bilgisi</h2>
        <p><strong>Tur Adı:</strong> ${req.body.turAdi}</p>
        <p><strong>Ad:</strong> ${req.body.ad}</p>
        <p><strong>Soyad:</strong> ${req.body.soyad}</p>
        <p><strong>İletişim Numarası:</strong> ${req.body.iletisimNumarasi}</p>
        <p><strong>Mesaj:</strong> ${req.body.mesaj}</p>
      `,
    });

    res.status(201).json({ message: "Rezervasyon oluşturuldu ve mail gönderildi", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ---- DATABASE VE SERVER BAŞLAT ----
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");

    // Route’ları logla
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(", ").toUpperCase();
        console.log(`✅ Route: ${methods} ${middleware.route.path}`);
      }
    });

    // Server başlat
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
