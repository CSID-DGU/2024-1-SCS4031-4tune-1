package com.fortune.eyesee.service;

import com.fortune.eyesee.dto.ExamReportResponseDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ExcelService {

    public ByteArrayInputStream generateExcelFile(ExamReportResponseDTO report) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Exam Report");

            // 헤더
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("항목");
            headerRow.createCell(1).setCellValue("값");

            // 시험 이름
            Row examNameRow = sheet.createRow(1);
            examNameRow.createCell(0).setCellValue("시험 이름");
            examNameRow.createCell(1).setCellValue(report.getExamName());

            // 부정행위 관련 정보
            int rowNum = 2; // 초기 행 번호
            sheet.createRow(rowNum++).createCell(0).setCellValue("총 탐지된 부정행위 건수");
            sheet.getRow(rowNum - 1).createCell(1).setCellValue(report.getTotalCheatingCount());

            sheet.createRow(rowNum++).createCell(0).setCellValue("부정행위 탐지된 학생 수");
            sheet.getRow(rowNum - 1).createCell(1).setCellValue(report.getCheatingStudentsCount());

            sheet.createRow(rowNum++).createCell(0).setCellValue("평균 부정행위 탐지 건수");
            sheet.getRow(rowNum - 1).createCell(1).setCellValue(report.getAverageCheatingCount());

            sheet.createRow(rowNum++).createCell(0).setCellValue("최다 부정행위 탐지 학생");
            sheet.getRow(rowNum - 1).createCell(1).setCellValue(report.getMaxCheatingStudent());

            sheet.createRow(rowNum++).createCell(0).setCellValue("부정행위 탐지율");
            sheet.getRow(rowNum - 1).createCell(1).setCellValue(report.getCheatingRate() + "%");

            // 부정행위 유형별 통계
            sheet.createRow(rowNum++).createCell(0).setCellValue("부정행위 유형별 통계");
            AtomicInteger finalRowNum = new AtomicInteger(rowNum);
            report.getCheatingTypeStatistics().forEach((type, count) -> {
                Row row = sheet.createRow(finalRowNum.getAndIncrement());
                row.createCell(0).setCellValue(type);
                row.createCell(1).setCellValue(count);
            });

            // 부정행위 발생 시간대
            sheet.createRow(finalRowNum.getAndIncrement()).createCell(0).setCellValue("부정행위 발생 시간대");
            sheet.getRow(finalRowNum.get() - 1).createCell(1).setCellValue(report.getPeakCheatingTimeRange());

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


}
