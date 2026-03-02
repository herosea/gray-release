package com.example.gray_release_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedResult<T> {
    private Integer page;
    private Integer size;
    private Long total;
    private List<T> items;
}
