package com.finance.tracker.currency.mapper;

import com.finance.tracker.currency.dto.CurrencyDTO;
import com.finance.tracker.currency.entity.Currency;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CurrencyMapper {
    
    public CurrencyDTO toDTO(Currency currency) {
        if (currency == null) {
            return null;
        }
        
        CurrencyDTO dto = new CurrencyDTO();
        dto.setId(currency.getId());
        dto.setCode(currency.getCode());
        dto.setSymbol(currency.getSymbol());
        dto.setName(currency.getName());
        dto.setIsActive(currency.getIsActive());
        dto.setCreatedAt(currency.getCreatedAt());
        dto.setUpdatedAt(currency.getUpdatedAt());
        
        return dto;
    }
    
    public List<CurrencyDTO> toDTOList(List<Currency> currencies) {
        if (currencies == null) {
            return null;
        }
        return currencies.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}

