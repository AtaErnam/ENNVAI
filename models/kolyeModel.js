const mongoose = require("mongoose");

const kolyeSchema = new mongoose.Schema({
  ürünStili: {
    type: String,
  },
  kod: {
    type: {
      type: String,
    },
    kod1: String,
    kod2: String,
  },
  isim: {
    type: String,
  },
  GR: {
    type: Number,
  },
  orta: {
    type: {
      type: String,
    },
    CT: Number,
    ADET: Number,
    TAŞ: String,
    SAFLIK: String,
    BERRAKLIK: String,
    ŞEKLİ: String,
  },
  kenar: {
    type: {
      type: String,
    },
    CT: Number,
    ADET: Number,
    TAŞ: String,
    SAFLIK: String,
    BERRAKLIK: String,
    ŞEKLİ: String,
  },
  kenarBaget: {
    type: {
      type: String,
    },
    CT: Number,
    ADET: Number,
    TAŞ: String,
    SAFLIK: String,
    BERRAKLIK: String,
    ŞEKLİ: String,
  },
  renkli: {
    type: {
      type: String,
    },
    CT: Number,
    ADET: Number,
    TAŞ: String,
    RENK: String,
    ŞEKLİ: String,
  },
  tlsatış: {
    type: {
      type: Number,
    },
    KT_8: Number,
    KT_14: Number,
    KT_18: Number,
  },
  indirim: {
    type: Number,
  },
  resimler: {
    type: {
      type: Number,
    },
    BEYAZ: String,
    KIRMIZI: String,
    SARI: String,
  },
  outlet: {
    type: {
      type: Number,
    },
    KT_8: Number,
    KT_14: Number,
    KT_18: Number,
  },
});

const Kolye = mongoose.model("Kolye", kolyeSchema);

module.exports = Kolye;
