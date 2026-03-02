package com.example.gray_release_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BizException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBizException(BizException ex) {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("code", ex.getCode());
        response.put("message", ex.getMessage());
        return response;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleException(Exception ex) {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("code", "INTERNAL_ERROR");
        response.put("message", "服务异常，请稍后再试");
        return response;
    }
}
