package com.fortune.eyesee.service;

import com.fortune.eyesee.dto.ExamReportResponseDTO;
import com.fortune.eyesee.dto.UserListResponseDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ExcelService {

    public ByteArrayInputStream generateExcelFile(ExamReportResponseDTO report, List<UserListResponseDTO.UserInfo> userInfos) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Exam Report");


            // 시험 이름
            Row examNameRow = sheet.createRow(0);
            examNameRow.createCell(0).setCellValue("시험 이름");
            examNameRow.createCell(1).setCellValue(report.getExamName());

            // 시험 날짜 및 시간
            Row examDateRow = sheet.createRow(1);
            examDateRow.createCell(0).setCellValue("시험 날짜 및 시간");
            examDateRow.createCell(1).setCellValue(report.getExamDate() + " " + report.getExamStartTime());

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

            // 빈 줄 추가
            finalRowNum.getAndIncrement();

            // 학생 정보 헤더 추가
            Row userHeaderRow = sheet.createRow(finalRowNum.getAndIncrement());
            userHeaderRow.createCell(0).setCellValue("학생 이름");
            userHeaderRow.createCell(1).setCellValue("학번");
            userHeaderRow.createCell(2).setCellValue("좌석 번호");
            userHeaderRow.createCell(3).setCellValue("부정행위 횟수");

            // 학생 정보 추가
            userInfos.forEach(userInfo -> {
                Row row = sheet.createRow(finalRowNum.getAndIncrement());
                row.createCell(0).setCellValue(userInfo.getUserName());
                row.createCell(1).setCellValue(userInfo.getUserNum());
                row.createCell(2).setCellValue(userInfo.getSeatNum());
                row.createCell(3).setCellValue(userInfo.getCheatingCount());
            });


            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


}
