-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bluemoon
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `can_ho`
--

DROP TABLE IF EXISTS `can_ho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `can_ho` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_can_ho` varchar(20) DEFAULT NULL,
  `ten_can_ho` varchar(100) DEFAULT NULL,
  `tang` varchar(50) DEFAULT NULL,
  `dien_tich` float DEFAULT NULL,
  `trang_thai` enum('trong','chu_o','cho_thue') DEFAULT 'trong',
  `ngay_bat_dau_thue` date DEFAULT NULL,
  `ngay_ket_thuc_thue` date DEFAULT NULL,
  `mo_ta` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_can_ho` (`ma_can_ho`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `can_ho`
--

LOCK TABLES `can_ho` WRITE;
/*!40000 ALTER TABLE `can_ho` DISABLE KEYS */;
/*!40000 ALTER TABLE `can_ho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ho_khau`
--

DROP TABLE IF EXISTS `ho_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ho_khau` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_ho_khau` varchar(20) DEFAULT NULL,
  `id_can_ho` int DEFAULT NULL,
  `id_chu_ho` int DEFAULT NULL,
  `dia_chi_thuong_tru` varchar(200) DEFAULT NULL,
  `noi_cap` varchar(200) DEFAULT NULL,
  `ngay_cap` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_ho_khau` (`ma_ho_khau`),
  KEY `id_can_ho` (`id_can_ho`),
  KEY `fk_chu_ho` (`id_chu_ho`),
  CONSTRAINT `fk_chu_ho` FOREIGN KEY (`id_chu_ho`) REFERENCES `nhan_khau` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ho_khau_ibfk_1` FOREIGN KEY (`id_can_ho`) REFERENCES `can_ho` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ho_khau`
--

LOCK TABLES `ho_khau` WRITE;
/*!40000 ALTER TABLE `ho_khau` DISABLE KEYS */;
/*!40000 ALTER TABLE `ho_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS `hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_hoa_don` varchar(30) DEFAULT NULL,
  `id_khoan_thu_ho_khau` int DEFAULT NULL,
  `so_tien_da_nop` int DEFAULT NULL,
  `ngay_nop` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_hoa_don` (`ma_hoa_don`),
  KEY `id_khoan_thu_ho_khau` (`id_khoan_thu_ho_khau`),
  CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`id_khoan_thu_ho_khau`) REFERENCES `khoan_thu_ho_khau` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don`
--

LOCK TABLES `hoa_don` WRITE;
/*!40000 ALTER TABLE `hoa_don` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoa_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khoan_thu`
--

DROP TABLE IF EXISTS `khoan_thu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khoan_thu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_khoan_thu` varchar(20) DEFAULT NULL,
  `ten_khoan_thu` varchar(100) DEFAULT NULL,
  `loai_khoan_thu` enum('dinh_ky','mot_lan') DEFAULT NULL,
  `chi_tiet` varchar(500) DEFAULT NULL,
  `ghi_chu` varchar(200) DEFAULT NULL,
  `thoi_gian_bat_dau` date DEFAULT NULL,
  `thoi_gian_ket_thuc` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_khoan_thu` (`ma_khoan_thu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khoan_thu`
--

LOCK TABLES `khoan_thu` WRITE;
/*!40000 ALTER TABLE `khoan_thu` DISABLE KEYS */;
/*!40000 ALTER TABLE `khoan_thu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khoan_thu_ho_khau`
--

DROP TABLE IF EXISTS `khoan_thu_ho_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khoan_thu_ho_khau` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_khoan_thu` int DEFAULT NULL,
  `id_ho_khau` int DEFAULT NULL,
  `so_tien` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_khoan_thu` (`id_khoan_thu`),
  KEY `id_ho_khau` (`id_ho_khau`),
  CONSTRAINT `khoan_thu_ho_khau_ibfk_1` FOREIGN KEY (`id_khoan_thu`) REFERENCES `khoan_thu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `khoan_thu_ho_khau_ibfk_2` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khoan_thu_ho_khau`
--

LOCK TABLES `khoan_thu_ho_khau` WRITE;
/*!40000 ALTER TABLE `khoan_thu_ho_khau` DISABLE KEYS */;
/*!40000 ALTER TABLE `khoan_thu_ho_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_xe`
--

DROP TABLE IF EXISTS `loai_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_loai_xe` varchar(20) DEFAULT NULL,
  `ten_loai_xe` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_loai_xe` (`ma_loai_xe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_xe`
--

LOCK TABLES `loai_xe` WRITE;
/*!40000 ALTER TABLE `loai_xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `loai_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_khau`
--

DROP TABLE IF EXISTS `nhan_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_khau` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ho_khau` int DEFAULT NULL,
  `ma_ho_khau` varchar(20) DEFAULT NULL,
  `ho_ten` varchar(100) DEFAULT NULL,
  `can_cuoc_cong_dan` varchar(12) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `noi_sinh` varchar(100) DEFAULT NULL,
  `dan_toc` varchar(20) DEFAULT NULL,
  `nghe_nghiep` varchar(50) DEFAULT NULL,
  `quan_he` varchar(30) DEFAULT NULL,
  `ghi_chu` varchar(200) DEFAULT NULL,
  `trang_thai` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_1` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau`
--

LOCK TABLES `nhan_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhan_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tam_tru`
--

DROP TABLE IF EXISTS `tam_tru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tam_tru` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_nhan_khau` int DEFAULT NULL,
  `dia_chi_tam_tru` varchar(200) DEFAULT NULL,
  `can_cuoc_cong_dan` varchar(20) DEFAULT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_nhan_khau` (`id_nhan_khau`),
  CONSTRAINT `tam_tru_ibfk_1` FOREIGN KEY (`id_nhan_khau`) REFERENCES `nhan_khau` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_tru`
--

LOCK TABLES `tam_tru` WRITE;
/*!40000 ALTER TABLE `tam_tru` DISABLE KEYS */;
/*!40000 ALTER TABLE `tam_tru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tam_vang`
--

DROP TABLE IF EXISTS `tam_vang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tam_vang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_nhan_khau` int DEFAULT NULL,
  `thoi_han` date DEFAULT NULL,
  `ly_do` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_nhan_khau` (`id_nhan_khau`),
  CONSTRAINT `tam_vang_ibfk_1` FOREIGN KEY (`id_nhan_khau`) REFERENCES `nhan_khau` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_vang`
--

LOCK TABLES `tam_vang` WRITE;
/*!40000 ALTER TABLE `tam_vang` DISABLE KEYS */;
/*!40000 ALTER TABLE `tam_vang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xe`
--

DROP TABLE IF EXISTS `xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ho_khau` int DEFAULT NULL,
  `id_loai_xe` int DEFAULT NULL,
  `ten_xe` varchar(100) DEFAULT NULL,
  `bien_kiem_soat` varchar(50) DEFAULT NULL,
  `mo_ta` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_ho_khau` (`id_ho_khau`),
  KEY `id_loai_xe` (`id_loai_xe`),
  CONSTRAINT `xe_ibfk_1` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `xe_ibfk_2` FOREIGN KEY (`id_loai_xe`) REFERENCES `loai_xe` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xe`
--

LOCK TABLES `xe` WRITE;
/*!40000 ALTER TABLE `xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `xe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22  9:02:55
