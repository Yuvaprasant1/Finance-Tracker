package com.finance.tracker.dashboard.controller;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.dashboard.dto.DashboardSummaryDTO;
import com.finance.tracker.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getExpenseSummary(
            @RequestParam String userId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        DashboardSummaryDTO summary = dashboardService.getExpenseSummary(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}

