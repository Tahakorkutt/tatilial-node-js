Api indirildikten sonra gereki modüller json ile gelmesi gerekiyor. Modüller indirilmez ise çalıştırılırken eksik modüller hatta veriri ve onları indirmek gerekebilir.
node server.js ile api çalıştırılır
config klasörü altındaki config.js dosyasında synchronize: false, ise tablo oluşturulmaz. true yaparsak tablolar oluşturulur ama hali hazırda tablolar var ise bu seçenek false kalmalı
