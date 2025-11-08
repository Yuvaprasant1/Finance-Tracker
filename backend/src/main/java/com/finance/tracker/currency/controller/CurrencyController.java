package com.finance.tracker.currency.controller;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.currency.dto.CurrencyDTO;
import com.finance.tracker.currency.exception.CurrencyNotFoundException;
import com.finance.tracker.currency.mapper.CurrencyMapper;
import com.finance.tracker.currency.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/currencies")
@RequiredArgsConstructor
public class CurrencyController {
    
    private final CurrencyRepository currencyRepository;
    private final CurrencyMapper currencyMapper;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CurrencyDTO>>> getAllCurrencies() {
        List<CurrencyDTO> currencyDTOs = currencyMapper.toDTOList(
                currencyRepository.findByIsActiveTrue());
        return ResponseEntity.ok(ApiResponse.success(currencyDTOs));
    }
}

